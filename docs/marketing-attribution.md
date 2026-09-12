# Источники и конверсии Anix

## Как устроена цепочка

Источник → случайный visitor_id → несколько session_id → просмотренные страницы →
conversion snapshot → website_leads / ai_chat_sessions → amocrm_lead_id → поля сделки.

Единый контракт находится в src/lib/attribution.js. Команда
`node scripts/sync-attribution.js` копирует его в Edge Functions; CI проверяет совпадение.
leadSession.js обслуживает сайт, форму и LLM. Новый dashboard или рекламный SDK не добавлен.

В localStorage хранится anix_visitor_v2. First touch — первый **значимый** источник
в окне 90 дней; last touch — последний значимый источник. Каждый touch хранится
90 дней от своего touch_at. Direct не перезаписывает их. Пока значимого источника
не было, touches пусты, в CRM источник обозначается direct.
Visitor ID сохраняется между визитами до очистки данных сайта браузером.
На другом устройстве или после очистки данных это новый посетитель.

sessionStorage хранит отдельную сессию вкладки. Переходы между документами сохраняют
сессию; новая вкладка и возврат после 30 минут неактивности начинают новую.
Счётчик visits означает такие сессии, включая вкладки, а не число уникальных людей.
Web Locks сериализует изменение first touch и счётчика между вкладками;
при запрете API/storage используется best effort и память страницы. В этом режиме
форма и навигация работают, но сквозное узнавание посетителя невозможно.

Current session описывает текущий визит, first/last — историю источников посетителя.
Внутренний referrer и переход без новых меток не считаются новым каналом.
Новая кампания записывается целиком: offer старой кампании не приписывается новой.
Хранятся пять UTM, gclid/yclid и пять anix_* параметров, время входа, путь landing,
origin внешнего referrer, до 80 просмотренных путей и активное время на них.
Общее time_on_site_seconds — календарное время с начала сессии.
Query/hash исключены из сохранённых путей; контакты формы не включаются в attribution.

## Ссылки и единые названия

Генератор: https://studio.anix-ai.pro/internal/utm-builder/
Он не включён в меню или sitemap, имеет noindex/nofollow. Это инструмент без
авторизации и без секретных данных; noindex не является контролем доступа.
Выберите preset, страницу, заполните Campaign и дополнительные поля, скопируйте URL.
QR не добавлен: готовую ссылку можно использовать в принятом у команды QR-инструменте.

Правила: lowercase, ASCII, snake_case, без пробелов и контактов. Campaign должна
быть понятна через год: предмет + гипотеза/оффер + период. Генератор принимает
только HTTPS страницы studio.anix-ai.pro, не переносит посторонние query-параметры.

| Поле | Смысл | Пример |
| --- | --- | --- |
| utm_source | Площадка | telegram |
| utm_medium | Тип канала | organic |
| utm_campaign | Кампания/гипотеза | hse_onboarding_2026q3 |
| utm_content | Пост/объявление/CTA | multon_case_post |
| utm_term | Ключевое слово/аудитория | hse_director |
| anix_segment | Отрасль | hse |
| anix_offer | Оффер | hse_onboarding |
| anix_audience | Роль аудитории | hse_director |
| anix_asset | Материал | multon_case |
| anix_owner | Ответственный в команде | andrey |

anix_owner — согласованный код сотрудника команды, не имя клиента.
Не помещать email, телефон, Telegram username, имя клиента в метки.
Проверки отбрасывают узнаваемые контакты, но не заменяют дисциплину именования.

Поддержаны telegram, tenchat, vk, yandex, google, chatgpt, email, direct,
referral, conference, qr, partner, other. Алиасы tg/t.me → telegram,
vk.com/vkontakte → vk, ya/ya.ru → yandex и т. д.
Неизвестный источник не теряется и не заменяется на other; utm_source_raw
сохраняет исходное безопасное значение. Это позволяет разбирать старые ссылки.

Пример:
`https://studio.anix-ai.pro/hse/?utm_source=telegram&utm_medium=organic&utm_campaign=hse_onboarding_2026q3&utm_content=multon_case_post&utm_term=hse_director&anix_segment=hse&anix_offer=hse_onboarding&anix_audience=hse_director&anix_asset=multon_case&anix_owner=andrey`

## Конверсия и AmoCRM

Форма фиксирует snapshot в момент отправки; чат — при первой передаче лида в CRM.
База защищает уже сохранённый snapshot от перезаписи следующими обновлениями.
Он содержит visitor/session, first/last/current touch, conversion_type/page/cta,
повторность визита, число сессий и страницы. Старые клиенты без snapshot продолжают работать.

Миграция 015 добавляет поля в website_leads и ai_chat_sessions, индексы
visitor/session в lead_events, таблицу краткоживущих Telegram token и квот.
Отдельные таблицы visitors/sessions не нужны для этого объёма: события группируются
по индексированным ID, а достоверная история конверсии хранится прямо у лида.
Токены и квоты доступны только service_role; SQL RPC закрыты для anon/authenticated.

В AmoCRM остаётся читаемая заметка плюс 17 структурированных полей:
Visitor ID, First source/medium/campaign/content, Last source/medium/campaign/content,
Landing page, Conversion page/type, Anix Segment/Offer/Audience/Asset/Owner.
Названия и идентификаторы проверяются через API перед созданием.
Совпадение по имени или ANIX_* code переиспользуется; неоднозначное совпадение или
несовместимый тип останавливает provisioning. Создаются только недостающие поля.
Параллельное создание защищено блокировкой; повторный запуск безопасен.
Runtime не создаёт поля и не переписывает уже заполненные поля существующей сделки.
Ошибка обогащения не отменяет успешное создание контакта/сделки; её отражает
attribution_crm_synced=false.

Deploy workflow запускает scripts/provision-attribution.mjs: audit → provision →
reconcile. Он использует существующий SUPABASE_ACCESS_TOKEN, получает service_role
только в памяти, не выводит его в журнал. Журнал содержит безопасный аудит полей
и полученную карту IDs. Reconcile за запуск обрабатывает до 20 записей каждого
типа; при pending нужно повторить action reconcile. Старые лиды без snapshot
не получают выдуманный источник.

## Telegram: точный контракт для владельца бота

Кода Telegram bot в этом репозитории нет. Текущий адрес — t.me/anix_helper.
Token attribution **по умолчанию выключен**, пока владелец не подтвердит, что
это бот с поддержкой /start, и не внедрит обработчик. Обычный Telegram CTA работает.

Сайт заранее резервирует случайный token (32 hex), отдельный capture_key (64 hex)
остаётся в памяти браузера. На click отправляет snapshot через keepalive и открывает
`https://t.me/anix_helper?start=TOKEN`. В URL нет visitor ID, контактов или JSON.
Если API не ответил за 1.5 сек, token не готов или tracking сломан — обычная ссылка.
Click не ждёт сеть. Резервирование можно заполнить только в первые 5 минут;
заполненный token истекает через 7 дней. Истёкшие записи удаляются при новых квотах.

Публичный endpoint:
`https://ppoygmaqlaiqcisjetea.supabase.co/functions/v1/website-attribution`
принимает POST reserve и capture только с разрешённым Origin. Capture требует
token+capture_key+snapshot. Он не позволяет читать snapshot.

Endpoint для backend бота:
`https://ppoygmaqlaiqcisjetea.supabase.co/functions/v1/attribution-admin`
заголовки `Authorization: Bearer TELEGRAM_ATTRIBUTION_BOT_SECRET`,
`Content-Type: application/json`.
Этот отдельный секрет разрешает только redeem/link_deal, не управление CRM.

1. Обработчик /start валидирует token как 32 hex.
2. POST `{"action":"redeem","token":"TOKEN","telegram_user_id":"123456789"}`.
3. status=ok возвращает snapshot и amocrm_lead_id (если уже связан).
   status=pending означает гонку с capture: повторить через 0.5/1/2 секунды.
   not_found/already_redeemed или сбой API: продолжить обычный диалог без attribution.
4. Сохранить snapshot у лида бота в его постоянной базе **до истечения 7 дней**.
   Одной транзакцией/уникальным ключом token защищать создание сделки от дубля
   при параллельных /start. Redeem сам по себе не блокирует повтор одним аккаунтом.
5. Использовать возвращённый amocrm_lead_id или создать/найти сделку по правилам
   существующего бота. Заполнить пустые CRM-поля по тому же mapping и заметку.
6. POST `{"action":"link_deal","token":"TOKEN","telegram_user_id":"123456789","amocrm_lead_id":12345}`.
   ok=false при повторе: повторно redeem, использовать уже связанный ID.

Активация после проверки обработчика:

- Supabase → проект ppoygmaqlaiqcisjetea → Edge Functions → Secrets:
  создать TELEGRAM_ATTRIBUTION_BOT_SECRET со случайным серверным секретом минимум
  32 байта; то же значение внести в secrets среды бота. Не вставлять в сайт/GitHub.
- Проверить /start и повтор токена, сохранение snapshot, связь сделки.
- Там же установить TELEGRAM_ATTRIBUTION_ENABLED=true.
- Если anix_helper не бот, сначала согласовать адрес настоящего бота и заменить
  BASE и фильтр ссылок в src/lib/telegramAttribution.js вместе с CTA сайта.
- Быстрый откат: TELEGRAM_ATTRIBUTION_ENABLED=false, обычные CTA продолжают работать.

## События, отказоустойчивость и privacy

Основные события: page_view, showreel_open, case_open, pricing_view, cta_click,
telegram_click, email_click, form_start/submit/success/error, llm_open/message/lead.
Старые названия целей Метрики сохраняются; серверный track нормализует алиасы.
Каждая отправка имеет event_id: повтор сети не создаёт второй lead_events.
Метаданные фильтруются, произвольные сообщения/контакты в event context не попадают.
Недоступность Метрики, tracking API или storage не блокирует интерфейс.
Защита Turnstile и согласие формы сохраняются.

Раздел 7 privacy описывает random ID, срок 90 дней, передачу snapshot в Supabase
и AmoCRM и условную передачу через Telegram token. Fingerprinting не используется.
Дополнительного баннера не добавлено. Изменение текста не является правовым аудитом.
Окно 90 дней относится к attribution браузера, а не автоматическому удалению сделок.

## Проверки и следующий этап

Unit/contract tests покрывают first/last/direct, повторные визиты, вкладки,
storage/API failure, неизвестные источники, PII, неизменный snapshot формы,
структурированные CRM-поля, provisioning и права token endpoint.
`node scripts/attribution-browser-qa.js` проверяет production-сборку на desktop/mobile:
обычную и UTM главную, medicine, hse, cases, builder, форму, Telegram link, открытие
доступного чата, layout и console. Screenshots/report — artifacts/attribution-qa.
В Pages workflow тот же тест ждёт deployment.json с SHA текущего коммита, поэтому
не принимает старую опубликованную версию за успешный deploy.
Тест не отправляет выдуманные клиентские заявки и не обходит Turnstile.

Следующий этап: подписанный AmoCRM webhook + идемпотентная таблица изменений
статуса/суммы по amocrm_lead_id, валюта и дата продажи. Связать с snapshot лида
по amocrm_lead_id и visitor_id. Затем расходы по campaign/offer, ROMI/CAC.
Revenue import, расходы и dashboard в этой задаче не реализованы.
