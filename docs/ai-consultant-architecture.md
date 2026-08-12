# AI-консультант Anix: production-архитектура v1

## Контур

```text
React AiChatWidget
  → Supabase Edge Function ai-chat
    → Postgres: sessions, messages, rate limit, prompt
    → pgvector: knowledge chunks
    → Cloudflare Tunnel: https://llm.anix-ai.pro
      → local-ai-gateway/server.mjs
        → Ollama: qwen3:8b + embeddinggemma
    → shared amoCRM service, только для квалифицированного контакта
```

Сайт, форма заявок, Supabase и amoCRM не зависят от домашнего компьютера. Если gateway, Ollama или tunnel недоступны, пользовательское сообщение уже сохранено в Supabase. Edge Function возвращает HTTP 200 с `fallback=true` и нормальным предложением оставить контакт.

## Публичный endpoint

`POST /functions/v1/ai-chat`

Новая сессия:

```json
{
  "request_id": "uuid",
  "message": "Нужно объяснить медицинскую технологию",
  "turnstile_token": "single-use token",
  "privacy_consent": true,
  "privacy_policy_version": "2026-08-07",
  "context": {
    "session_id": "website tracking session",
    "page_path": "/medicine",
    "pages_viewed": []
  }
}
```

Ответ возвращает `session_id` и отдельный случайный `session_token`. В базе хранится только SHA-256 токена. Следующие сообщения и восстановление диалога используют эту пару. Это не административный и не Supabase-токен.

Восстановление:

```json
{
  "action": "resume",
  "session_id": "uuid",
  "session_token": "opaque token"
}
```

## Local AI Gateway

`POST /v1/chat` и `POST /v1/embed` требуют `Authorization: Bearer <LOCAL_AI_GATEWAY_SECRET>`. `GET /health` доступен без секрета и не принимает пользовательские данные.

### `GET /health`

Проверяет gateway, Ollama и список установленных моделей. Возвращает 503, если Ollama недоступна, при этом сам gateway продолжает работать.

### `POST /v1/chat`

Принимает `messages`, `system_prompt`, `retrieved_context`, `model`, `model_parameters`, `request_id`. Адаптер переводит это в Ollama `/api/chat`. React и Supabase не зависят от формата Ollama.

### `POST /v1/embed`

Принимает строку или массив в `input`, `model`, `request_id`. Адаптер вызывает Ollama `/api/embed` и возвращает единый массив `embeddings`.

## RAG

Миграция `005_ai_consultant_v1.sql` создаёт:

- `knowledge_sources`;
- `knowledge_documents`;
- `knowledge_chunks`;
- `match_knowledge_chunks`;
- HNSW-индекс для cosine distance.

Размерность v1 — 768, модель по умолчанию — `embeddinggemma`. Смена chat-модели не требует повторной индексации. Смена embedding-модели на модель с другой размерностью требует отдельной миграции и полной переиндексации.

Контекст ограничен шестью chunks и 24 000 символов. Если на `/medicine` или `/hse` нет результатов с вертикальным фильтром, выполняется второй поиск по общей базе.

## System prompt и квалификация

Prompt хранится в `ai_chat_prompts`, а не в React и не внутри огромной базы знаний. Активная версия выбирается серверно.

Модель возвращает JSON: ответ, накопительную квалификацию, коммерческую готовность, summary и следующий шаг. Edge Function валидирует поля. Контакт дополнительно извлекается детерминированно из текста, поэтому email, телефон или Telegram не зависят только от качества LLM.

Сделка создаётся, когда посетитель явно оставил контакт или модель одновременно видит контакт и готовность к следующему шагу. Теги: `website` и `website-ai-chat`. Повторные запросы той же сессии используют сохранённые amoCRM ID.

## Security

- React знает только публичный URL Edge Function и публичный Turnstile Site Key.
- Service role, amoCRM token и gateway secret хранятся только в Supabase Secrets или локальном environment.
- Ollama слушает только localhost. Порт 11434 не публикуется.
- Gateway слушает `127.0.0.1:8788`; наружу выходит только Cloudflare Tunnel.
- Новая chat-сессия требует Turnstile и согласие на обработку данных.
- Все запросы ограничены серверным rate limit по хешу IP + User-Agent. Сырые IP в chat-таблицы не пишутся.
- RLS закрывает прямой доступ `anon` и `authenticated` ко всем chat и knowledge таблицам.
- Полученные knowledge chunks считаются данными, а не инструкциями.

## Наблюдаемость

Edge Function пишет структурированный лог с `request_id`, `session_id`, общей задержкой, retrieval latency, LLM latency, моделью, числом chunks, размером контекста, error class и результатом CRM sync. Секреты и полный prompt в лог не попадают.

Поля сессии содержат `llm_status`, `last_error_class`, `crm_sync_status` и `crm_sync_error`. Полный transcript хранится в `ai_chat_messages`.

## Штатные отказы

| Сбой                 | Поведение                                      |
| -------------------- | ---------------------------------------------- |
| ПК выключен          | Сообщение сохранено, ответ-fallback            |
| Tunnel недоступен    | Сообщение сохранено, ответ-fallback            |
| Ollama timeout       | Сообщение сохранено, `llm_status=timeout`      |
| Embedding не получен | Без выдуманного ответа: fallback               |
| RAG вернул 0 chunks  | LLM явно получает «источников нет»             |
| amoCRM недоступна    | Диалог продолжается, `crm_sync_status=error`   |
| Повтор request ID    | Возвращается сохранённый assistant response    |
| Rate limit превышен  | HTTP 429, React показывает спокойное сообщение |
