# Локальная LLM Anix на Windows 10

Ниже — инфраструктурные шаги, которые выполняются один раз на компьютере владельца Anix. Секреты не добавляются в Git.

## 1. Установить runtime

Нужны:

- Node.js 18 или новее;
- Ollama;
- `cloudflared`;
- Git для обновления репозитория.

Проверка в PowerShell:

```powershell
node --version
ollama --version
cloudflared --version
git --version
```

## 2. Установить модели

```powershell
ollama pull qwen3:8b
ollama pull embeddinggemma
ollama list
```

`qwen3:8b` — стартовая конфигурация для RTX 3060 12 GB. `qwen3:14b` можно включить позднее одной переменной, но ответы будут медленнее. `embeddinggemma` менять без переиндексации базы нельзя.

## 3. Настроить local gateway

В корне репозитория:

```powershell
Copy-Item local-ai-gateway\.env.local-ai.example local-ai-gateway\.env.local-ai
```

Сгенерировать локальный секрет:

```powershell
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToHexString($bytes).ToLower()
```

Вставить результат в `local-ai-gateway\.env.local-ai` как `LOCAL_AI_GATEWAY_SECRET`. Этот же секрет позднее добавить в Supabase Secrets.

Первый запуск:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\windows\start-local-ai.ps1
```

Проверка из второго PowerShell:

```powershell
Get-Content local-ai-gateway\.env.local-ai | ForEach-Object {
  if ($_ -match '^([^#=]+)=(.*)$') { Set-Item "env:$($matches[1])" $matches[2] }
}
npm run gateway:check
```

## 4. Создать Cloudflare Tunnel

```powershell
cloudflared tunnel login
cloudflared tunnel create anix-local-ai
cloudflared tunnel route dns anix-local-ai llm.anix-ai.pro
```

Создать `%USERPROFILE%\.cloudflared\config.yml`:

```yaml
tunnel: <TUNNEL-UUID>
credentials-file: C:\Users\<USER>\.cloudflared\<TUNNEL-UUID>.json
ingress:
  - hostname: llm.anix-ai.pro
    service: http://127.0.0.1:8787
  - service: http_status:404
```

Проверить вручную:

```powershell
cloudflared tunnel run anix-local-ai
```

Входящие порты на роутере и Windows Firewall открывать не нужно. Tunnel создаёт исходящее соединение.

## 5. Закрыть hostname через Cloudflare Access

В Zero Trust создать self-hosted application для `llm.anix-ai.pro`.

Создать Service Token, затем policy типа Service Auth, разрешающую только этот token. Сохранить:

- Client ID;
- Client Secret.

Проверка внешнего health endpoint:

```powershell
$headers = @{
  Authorization = "Bearer <LOCAL_AI_GATEWAY_SECRET>"
  "CF-Access-Client-Id" = "<CLIENT_ID>"
  "CF-Access-Client-Secret" = "<CLIENT_SECRET>"
}
Invoke-RestMethod https://llm.anix-ai.pro/health -Headers $headers
```

Без всех трёх значений endpoint не должен отвечать данными Ollama.

## 6. Добавить Supabase Secrets

В проект `ppoygmaqlaiqcisjetea` добавить:

```text
LOCAL_AI_GATEWAY_URL=https://llm.anix-ai.pro
LOCAL_AI_GATEWAY_SECRET=<тот же локальный gateway secret>
CF_ACCESS_CLIENT_ID=<Cloudflare Service Token Client ID>
CF_ACCESS_CLIENT_SECRET=<Cloudflare Service Token Client Secret>
CHAT_MODEL=qwen3:8b
EMBEDDING_MODEL=embeddinggemma
LOCAL_AI_CHAT_TIMEOUT_MS=45000
LOCAL_AI_EMBED_TIMEOUT_MS=12000
AI_CHAT_RATE_LIMIT=24
AI_CHAT_RATE_WINDOW_SECONDS=600
AI_CHAT_ALLOWED_ORIGINS=https://studio.anix-ai.pro,https://dev.studio.anix-ai.pro
```

Существующий `TURNSTILE_SECRET_KEY` используется и формой, и AI-чатом. На frontend остаётся существующий `REACT_APP_TURNSTILE_SITE_KEY`.

## 7. Включить автозапуск

Cloudflare Tunnel установить как Windows Service из PowerShell с правами администратора:

```powershell
cloudflared service install
```

Gateway и Ollama зарегистрировать в Task Scheduler:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\windows\register-local-ai-autostart.ps1
```

Скрипт создаёт задачу `Anix Local AI Gateway` при входе пользователя и перезапускает её после сбоев. `start-local-ai.ps1` сам поднимает `ollama serve`, если Ollama ещё не отвечает.

## 8. Загрузить знания

Создать вне репозитория приватный env-файл, например `C:\Anix\knowledge.env`:

```text
SUPABASE_URL=https://ppoygmaqlaiqcisjetea.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service role>
LOCAL_AI_GATEWAY_LOCAL_URL=http://127.0.0.1:8787
LOCAL_AI_GATEWAY_SECRET=<gateway secret>
EMBEDDING_MODEL=embeddinggemma
```

Примеры:

```powershell
npm run knowledge:ingest -- "C:\Anix\knowledge\rasshirennaya_baza_znaniy_video_onboarding_hse.txt" --source-slug anix-hse --source-title "Anix HSE" --vertical hse --env "C:\Anix\knowledge.env"

npm run knowledge:ingest -- "C:\Anix\knowledge\medtech_sales_kit_expanded_knowledge_base.txt" --source-slug anix-medtech --source-title "Anix MedTech" --vertical medicine --env "C:\Anix\knowledge.env"

npm run knowledge:ingest -- --url https://studio.anix-ai.pro/medicine/ --url https://studio.anix-ai.pro/hse/ --source-slug anix-site --source-title "Сайт Anix" --vertical general --env "C:\Anix\knowledge.env"
```

Внутренние базы знаний нельзя копировать в публичный репозиторий. Ingestion отправляет chunks и embeddings напрямую в закрытые Supabase-таблицы.

## 9. Production-проверка

Проверить по порядку:

1. `/health` через Cloudflare Access.
2. Обычный чат на главной.
3. Контекстный вопрос на `/medicine/`.
4. Контекстный вопрос на `/hse/`.
5. Обновление страницы и восстановление диалога.
6. Контакт только через email, телефон и Telegram.
7. Создание одной сделки с тегом `website-ai-chat`.
8. Выключить local gateway: сообщение сохраняется, сайт работает, появляется fallback.
9. Включить gateway и продолжить ту же сессию.
10. Проверить mobile 360–430 px и desktop.

## 10. Обновление моделей

Для перехода на другую chat-модель:

```powershell
ollama pull qwen3:14b
```

Затем поменять `CHAT_MODEL` в локальном `.env.local-ai` и Supabase Secrets. React, RAG schema и API contract менять не нужно.
