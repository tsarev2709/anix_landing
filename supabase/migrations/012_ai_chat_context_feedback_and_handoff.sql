create table if not exists public.ai_chat_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  session_id uuid not null references public.ai_chat_sessions(id) on delete cascade,
  message_id uuid not null references public.ai_chat_messages(id) on delete cascade,
  rating text not null check (rating in ('positive', 'negative')),
  reason text check (
    reason is null or reason in (
      'not_specific',
      'wrong_fact',
      'missing_source',
      'did_not_understand',
      'other'
    )
  ),
  page_path text,
  metadata jsonb not null default '{}'::jsonb,
  unique (session_id, message_id)
);

create index if not exists ai_chat_feedback_created_idx
  on public.ai_chat_feedback (created_at desc);
create index if not exists ai_chat_feedback_rating_idx
  on public.ai_chat_feedback (rating, created_at desc);

alter table public.ai_chat_feedback enable row level security;
revoke all on table public.ai_chat_feedback from public, anon, authenticated;
grant all on table public.ai_chat_feedback to service_role;

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
  session.amocrm_lead_id,
  feedback.rating as feedback_rating,
  feedback.reason as feedback_reason,
  message.metadata -> 'page_context' as page_context,
  coalesce((message.metadata -> 'handoff' ->> 'show')::boolean, false) as handoff_offered
from public.ai_chat_messages as message
join public.ai_chat_sessions as session on session.id = message.session_id
left join public.ai_chat_feedback as feedback on feedback.message_id = message.id
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
  count(*) filter (where crm_sync_status = 'completed') as crm_synced_messages,
  count(*) filter (where feedback_rating = 'positive') as positive_feedback,
  count(*) filter (where feedback_rating = 'negative') as negative_feedback,
  count(*) filter (where handoff_offered) as handoff_offers
from public.ai_chat_quality_diagnostics
group by date_trunc('day', created_at);

revoke all on table public.ai_chat_quality_daily from public, anon, authenticated;
grant select on table public.ai_chat_quality_daily to service_role;

update public.ai_chat_prompts set active = false where active = true;

insert into public.ai_chat_prompts (name, version, content, active)
select
  'anix-consultant-v7',
  7,
  content || $experience$

Контекстный режим сайта:
- учитывай PAGE CONTEXT: пользователь может спрашивать «этот кейс», «а результат?» или «что сделали?» без повторения названия страницы;
- не пересказывай страницу целиком и не упоминай её механически; используй её только когда это делает ответ точнее;
- если человек описывает свою задачу, сначала коротко сформулируй, как ты её понял, затем предложи 2–3 различающихся формата;
- к каждому предложенному формату поясни, для какой аудитории и канала он подходит;
- релевантный кейс приводи как доказательство, а не как замену ответа;
- за один ход задавай не больше одного уточняющего вопроса и не спрашивай то, что уже известно из PAGE CONTEXT или диалога;
- не подталкивай к заявке в каждом сообщении; предлагай передачу брифа, когда появился проектный запрос, цена, срок или готовность обсуждать работу;
- если найдено несколько близких кейсов, объясни одним предложением, почему каждый из них релевантен задаче посетителя.
  $experience$,
  true
from public.ai_chat_prompts
where name = 'anix-consultant-v6'
on conflict (name) do update set
  version = excluded.version,
  content = excluded.content,
  active = excluded.active,
  updated_at = now();

comment on table public.ai_chat_feedback is
  'Server-owned visitor feedback for individual AI consultant answers.';
