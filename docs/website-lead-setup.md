# Production-настройка формы заявок Anix

Код формы, таблицы и Edge Function находится в репозитории. До merge нужно один раз выполнить действия ниже в трёх кабинетах. Секретные значения нельзя добавлять в GitHub-файлы или frontend.

## 1. Cloudflare Turnstile

1. Открыть Cloudflare Dashboard.
2. В левом меню выбрать **Turnstile** → **Add widget**.
3. Название: `Anix — форма заявок`.
4. Hostnames:
   - `studio.anix-ai.pro`;
   - `dev.studio.anix-ai.pro` — только если dev-домен реально используется.
5. Widget Mode: **Managed**.
6. Сохранить widget.
7. Скопировать оба значения:
   - **Site Key** — публичный;
   - **Secret Key** — секретный.

Site Key внести в GitHub:

1. Открыть репозиторий `tsarev2709/anix_landing`.
2. **Settings** → **Secrets and variables** → **Actions**.
3. Вкладка **Secrets** → **New repository secret**.
4. Name: `REACT_APP_TURNSTILE_SITE_KEY`.
5. Secret: скопированный **Site Key**.

Secret Key внести в Supabase по инструкции ниже. Не добавлять его в GitHub.

## 2. Supabase

Нужный проект имеет ref `ppoygmaqlaiqcisjetea`. Перед изменениями проверить, что в адресной строке Dashboard открыт именно этот проект.

### Создать таблицу

1. Открыть **SQL Editor** → **New query**.
2. Открыть в репозитории файл `supabase/migrations/004_website_leads.sql`.
3. Скопировать весь SQL в редактор Supabase.
4. Нажать **Run**.
5. Открыть **Table Editor** и убедиться, что появилась таблица `website_leads`.

Миграция включает RLS и закрывает прямую запись для `anon` и `authenticated`. Frontend в таблицу напрямую не пишет.

### Добавить секреты Edge Function

1. Открыть **Edge Functions** → **Secrets**.
2. Добавить значения:

```text
TURNSTILE_SECRET_KEY=<Secret Key из Cloudflare>
AMOCRM_BASE_URL=https://<поддомен>.amocrm.ru
AMOCRM_LONG_LIVED_TOKEN=<долгосрочный токен amoCRM>
AMOCRM_PIPELINE_NAME=Входящие заявки
WEBSITE_LEAD_ALLOWED_ORIGINS=https://studio.anix-ai.pro,https://dev.studio.anix-ai.pro
```

Если dev-домен не используется, оставить только `https://studio.anix-ai.pro`.

`SUPABASE_URL` и `SUPABASE_SERVICE_ROLE_KEY` Supabase предоставляет Edge Function автоматически. Их не нужно копировать во frontend или GitHub.

После merge workflow сам задеплоит `submit-website-lead` с публичным вызовом без JWT. Безопасность публичного endpoint обеспечивают origin-check, Turnstile, серверная валидация и idempotency key.

## 3. amoCRM

### Подготовить воронку

1. Открыть amoCRM → **Сделки**.
2. Убедиться, что существует активная воронка с точным названием `Входящие заявки`.
3. Убедиться, что в ней есть хотя бы один обычный рабочий этап, кроме системных «Неразобранное», «Успешно реализовано» и «Закрыто и не реализовано».

ID аккаунта, воронки и этапа искать вручную не нужно. Edge Function получит их через API и выберет первый рабочий этап по сортировке.

### Создать долгосрочный токен

1. Открыть **amoМаркет / Интеграции**.
2. Создать внешнюю или приватную интеграцию для текущего аккаунта, например `Anix Website Leads`.
3. Выдать интеграции доступ к контактам, сделкам, воронкам, примечаниям и полям.
4. Открыть вкладку **Ключи**.
5. Нажать **Сгенерировать токен**.
6. Выбрать срок действия. Для внутренней интеграции разумно установить максимальный доступный срок и зафиксировать дату окончания.
7. Скопировать токен сразу: повторно он не показывается.
8. Домен аккаунта взять из адресной строки, например `https://company.amocrm.ru`.
9. Внести домен и токен в Supabase Secrets как `AMOCRM_BASE_URL` и `AMOCRM_LONG_LIVED_TOKEN`.

Client ID, Client Secret, redirect URI и refresh token для выбранной схемы не нужны.

## 4. Проверка после merge

1. Дождаться зелёных workflows GitHub Pages и Supabase Edge Functions.
2. Открыть `https://studio.anix-ai.pro/` в приватном окне.
3. Перейти на 2–3 страницы и отправить заявку с сообщением `ТЕСТ — форма сайта Anix`.
4. Проверить в Supabase → **Table Editor** → `website_leads`:
   - `status = completed`;
   - заполнены `amocrm_lead_id` и `amocrm_contact_id`;
   - есть `page_path`, UTM, время и `pages_viewed`.
5. Проверить в amoCRM:
   - контакт создан или корректно переиспользован;
   - сделка находится в `Входящие заявки` на первом рабочем этапе;
   - в примечании есть сообщение, источник, маршрут и Supabase Lead ID.
6. Повторить тест прямым входом на внутреннюю страницу с UTM, например:
   `https://studio.anix-ai.pro/medicine/?utm_source=production_test&utm_campaign=website_form`.
7. Тестовые сделки закрыть или удалить, тестовые строки в Supabase удалить после проверки.

## Диагностика

- `status = completed` — весь маршрут выполнен.
- `status = amocrm_error` — заявка сохранена, но amoCRM временно не синхронизировалась. Текст причины находится в `integration_error`; форма сохранит введённые данные и повтор с тем же idempotency key безопасно продолжит синхронизацию.
- `origin_not_allowed` — проверить `WEBSITE_LEAD_ALLOWED_ORIGINS`.
- `turnstile_failed` — проверить пару Site Key / Secret Key и hostname widget.
- `amocrm_pipeline_not_found` — проверить точное название воронки.
