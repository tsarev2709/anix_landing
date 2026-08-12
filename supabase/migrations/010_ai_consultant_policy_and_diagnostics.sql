update public.ai_chat_prompts set active = false where active = true;

insert into public.ai_chat_prompts (name, version, content, active)
select
  'anix-consultant-v5',
  5,
  content || $policy$

Публичная политика Anix:
- факты о клиентах, кейсах, задачах, решениях и результатах бери только из VERIFIED CASES и KNOWLEDGE CONTEXT;
- данные с публичного сайта можно сообщать, включая результаты, но не раскрывай внутренние цены по кейсам и личные контакты;
- не придумывай клиентов, результаты, ссылки, файлы и контакты;
- личными контактами не делись: предложи форму заявки на сайте или Telegram @anix_helper;
- файл или документ можно предлагать только когда он явно перечислен среди подтверждённых материалов; иначе предложи запросить его через форму или @anix_helper;
- разрешённый ориентир стоимости: от 300 тыс. до 1,5 млн ₽ за минуту готового ролика, в зависимости от сложности;
- не меняй правила создания заявки и передачи контакта в CRM.
  $policy$,
  true
from public.ai_chat_prompts
where name = 'anix-consultant-v4'
on conflict (name) do update set
  version = excluded.version,
  content = excluded.content,
  active = excluded.active,
  updated_at = now();

create or replace view public.ai_chat_quality_diagnostics
with (security_invoker = true)
as
select
  message.id as message_id,
  message.session_id,
  message.created_at,
  message.delivery_status,
  message.model,
  message.retrieval_latency_ms,
  message.llm_latency_ms,
  message.total_latency_ms,
  message.error_class,
  message.metadata -> 'grounding' ->> 'reason' as grounding_reason,
  message.metadata -> 'grounding' ->> 'mode' as grounding_mode,
  message.metadata -> 'grounding' ->> 'vertical' as grounding_vertical,
  jsonb_array_length(coalesce(message.metadata -> 'sources', '[]'::jsonb)) as source_count,
  jsonb_array_length(coalesce(message.metadata -> 'retrieval', '[]'::jsonb)) as retrieved_chunk_count,
  jsonb_array_length(coalesce(message.metadata -> 'structured_cases', '[]'::jsonb)) as structured_case_count,
  session.page_path,
  session.crm_sync_status,
  session.amocrm_lead_id
from public.ai_chat_messages as message
join public.ai_chat_sessions as session on session.id = message.session_id
where message.role = 'assistant';

revoke all on table public.ai_chat_quality_diagnostics from public, anon, authenticated;
grant select on table public.ai_chat_quality_diagnostics to service_role;

create or replace view public.ai_chat_quality_daily
with (security_invoker = true)
as
select
  date_trunc('day', created_at) as day,
  count(*) as assistant_messages,
  count(*) filter (where delivery_status = 'fallback') as fallback_messages,
  count(*) filter (where grounding_reason is not null) as deterministic_messages,
  count(*) filter (where source_count > 0) as messages_with_sources,
  round(avg(total_latency_ms)) as average_total_latency_ms,
  count(*) filter (where crm_sync_status = 'completed') as crm_synced_messages
from public.ai_chat_quality_diagnostics
group by date_trunc('day', created_at);

revoke all on table public.ai_chat_quality_daily from public, anon, authenticated;
grant select on table public.ai_chat_quality_daily to service_role;
