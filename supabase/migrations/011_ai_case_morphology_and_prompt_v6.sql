create or replace function public.ai_search_signature(value text)
returns text[]
language sql
immutable
parallel safe
as $$
  select coalesce(
    array_agg(distinct case when length(token) > 5 then left(token, 5) else token end),
    array[]::text[]
  )
  from regexp_split_to_table(public.ai_normalize_search_text(value), '\\s+') as token
  where token <> '';
$$;

create or replace function public.search_ai_public_cases(
  query_text text default '',
  filter_vertical text default null,
  match_count integer default 10
)
returns table (
  id uuid,
  slug text,
  display_name text,
  client_name text,
  vertical text,
  category text,
  title text,
  summary text,
  task text,
  solution text,
  result text,
  tags jsonb,
  public_url text,
  assets jsonb,
  exact_match boolean,
  retrieval_score double precision
)
language sql
stable
security definer
set search_path = public
as $$
  with query as (
    select
      public.ai_normalize_search_text(query_text) as normalized,
      public.ai_search_signature(query_text) as signature
  ), ranked as (
    select
      case_record.*,
      client.name as client_name,
      coalesce(max(
        case when query.normalized <> ''
          and query.signature @> public.ai_search_signature(alias.normalized_alias)
        then 1 else 0 end
      ), 0) = 1 as exact_match,
      coalesce(max(
        case when query.normalized <> ''
          and query.signature @> public.ai_search_signature(alias.normalized_alias)
        then 100.0 else 0.0 end
      ), 0.0) +
      ts_rank_cd(
        to_tsvector('simple', concat_ws(' ', case_record.display_name, case_record.title, case_record.summary, case_record.tags::text)),
        plainto_tsquery('simple', query.normalized),
        32
      ) * 10.0 as retrieval_score
    from public.ai_knowledge_cases as case_record
    cross join query
    left join public.ai_knowledge_clients as client on client.id = case_record.client_id
    left join public.ai_knowledge_case_aliases as alias on alias.case_id = case_record.id
    where case_record.published = true
      and (filter_vertical is null or case_record.vertical = filter_vertical)
    group by case_record.id, client.name, query.normalized, query.signature
  )
  select
    ranked.id,
    ranked.slug,
    ranked.display_name,
    ranked.client_name,
    ranked.vertical,
    ranked.category,
    ranked.title,
    ranked.summary,
    ranked.task,
    ranked.solution,
    ranked.result,
    ranked.tags,
    ranked.public_url,
    coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', asset.id,
        'kind', asset.kind,
        'label', asset.label,
        'url', asset.url
      ) order by case asset.kind when 'case_page' then 1 when 'video' then 2 else 3 end)
      from public.ai_knowledge_assets as asset
      where asset.case_id = ranked.id and asset.published = true
    ), '[]'::jsonb) as assets,
    ranked.exact_match,
    ranked.retrieval_score
  from ranked
  where public.ai_normalize_search_text(query_text) = ''
    or ranked.exact_match
    or ranked.retrieval_score > 0.01
  order by ranked.exact_match desc, ranked.retrieval_score desc, ranked.sort_order
  limit greatest(1, least(match_count, 30));
$$;

revoke all on function public.ai_search_signature(text) from public, anon, authenticated;
grant execute on function public.ai_search_signature(text) to service_role;
revoke all on function public.search_ai_public_cases(text, text, integer)
  from public, anon, authenticated;
grant execute on function public.search_ai_public_cases(text, text, integer)
  to service_role;

update public.ai_chat_prompts set active = false where active = true;

insert into public.ai_chat_prompts (name, version, content, active)
select
  'anix-consultant-v6',
  6,
  content || $playbook$

Стандарт сильного ответа Anix:
- сначала дай прямой содержательный ответ на вопрос, затем добавь подтверждённый пример или полезный следующий шаг;
- не отвечай общими фразами вроде «мы создаём качественный контент», если можно назвать конкретный подход, механику или кейс из контекста;
- если посетитель описывает задачу, предложи 2–3 подходящих формата и коротко объясни различия между ними;
- если данных недостаточно, задай один самый полезный уточняющий вопрос; не превращай диалог в анкету;
- различай подтверждённый опыт Anix и новую идею для посетителя: идею помечай как предложение или гипотезу;
- при сравнении вариантов используй критерии: аудитория, канал, сложность объяснения, требуемая глубина, срок жизни материала;
- отвечай компактно: обычно 2–5 коротких абзацев или до 7 пунктов;
- используй контекст предыдущих сообщений: «подробнее», «а результат?», «дай ссылку» относятся к последнему обсуждавшемуся кейсу или формату;
- не повторяй уже сказанное без новой пользы;
- когда пользователь готов обсуждать проект, предложи форму или @anix_helper, но не проси контакт раньше времени.
  $playbook$,
  true
from public.ai_chat_prompts
where name = 'anix-consultant-v5'
on conflict (name) do update set
  version = excluded.version,
  content = excluded.content,
  active = excluded.active,
  updated_at = now();
