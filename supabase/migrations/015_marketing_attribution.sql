-- Additive: existing forms, lead_events and chat sessions remain valid.
alter table public.website_leads add column if not exists visitor_id text;
alter table public.website_leads add column if not exists attribution_snapshot jsonb;
alter table public.website_leads add column if not exists attribution_crm_synced boolean;
alter table public.ai_chat_sessions add column if not exists visitor_id text;
alter table public.ai_chat_sessions add column if not exists attribution_snapshot jsonb;
alter table public.ai_chat_sessions add column if not exists attribution_crm_synced boolean;
alter table public.lead_events add column if not exists event_id text;
alter table public.lead_events add column if not exists visitor_id text;
alter table public.lead_events add column if not exists session_id text;
create unique index if not exists lead_events_event_id_idx on public.lead_events(event_id) where event_id is not null;
create index if not exists lead_events_visitor_session_idx on public.lead_events(visitor_id, session_id);
create index if not exists website_leads_visitor_idx on public.website_leads(visitor_id);
create index if not exists ai_chat_sessions_visitor_idx on public.ai_chat_sessions(visitor_id);

create table public.website_attribution_tokens (
  token text primary key check (token ~ '^[a-f0-9]{32}$'),
  capture_key_hash text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days',
  attribution_snapshot jsonb,
  visitor_id text, session_id text,
  redeemed_at timestamptz, telegram_subject_hash text,
  amocrm_lead_id bigint,
  check (attribution_snapshot is null or octet_length(attribution_snapshot::text) <= 60000)
);
create index website_attribution_tokens_visitor_idx on public.website_attribution_tokens(visitor_id, session_id);
create table public.website_attribution_limits (
  key text primary key, hits integer not null default 1, expires_at timestamptz not null
);
alter table public.website_attribution_tokens enable row level security;
alter table public.website_attribution_limits enable row level security;
revoke all on public.website_attribution_tokens, public.website_attribution_limits from anon, authenticated;
grant all on public.website_attribution_tokens, public.website_attribution_limits to service_role;

create or replace function public.website_attribution_quota(p_key text, p_limit integer, p_seconds integer)
returns boolean language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  delete from website_attribution_limits where expires_at < now() - interval '1 day';
  delete from website_attribution_tokens where expires_at < now();
  insert into website_attribution_limits(key, expires_at) values (p_key, now() + make_interval(secs => p_seconds))
  on conflict(key) do update set
    hits = case when website_attribution_limits.expires_at < now() then 1 else website_attribution_limits.hits + 1 end,
    expires_at = case when website_attribution_limits.expires_at < now() then excluded.expires_at else website_attribution_limits.expires_at end
  returning hits into n;
  return n <= p_limit;
end $$;
revoke all on function public.website_attribution_quota(text, integer, integer) from public, anon, authenticated;
grant execute on function public.website_attribution_quota(text, integer, integer) to service_role;

create or replace function public.protect_attribution_snapshot() returns trigger language plpgsql as $$
begin
  if old.attribution_snapshot is not null then
    new.attribution_snapshot := old.attribution_snapshot;
    new.visitor_id := old.visitor_id;
  end if;
  return new;
end $$;
create trigger website_leads_immutable_attribution before update on public.website_leads for each row execute function public.protect_attribution_snapshot();
create trigger ai_chat_immutable_attribution before update on public.ai_chat_sessions for each row execute function public.protect_attribution_snapshot();
create trigger telegram_immutable_attribution before update on public.website_attribution_tokens for each row execute function public.protect_attribution_snapshot();

-- Atomic bot binding; replay by another Telegram account cannot steal attribution.
create or replace function public.redeem_website_attribution(p_token text, p_subject_hash text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r website_attribution_tokens;
begin
  select * into r from website_attribution_tokens where token = p_token and expires_at > now() for update;
  if not found then return jsonb_build_object('status','not_found'); end if;
  if r.attribution_snapshot is null then return jsonb_build_object('status','pending'); end if;
  if r.telegram_subject_hash is not null and r.telegram_subject_hash <> p_subject_hash then return jsonb_build_object('status','already_redeemed'); end if;
  update website_attribution_tokens set telegram_subject_hash = p_subject_hash, redeemed_at = coalesce(redeemed_at,now()) where token=p_token;
  return jsonb_build_object('status','ok','snapshot',r.attribution_snapshot,'amocrm_lead_id',r.amocrm_lead_id);
end $$;
revoke all on function public.redeem_website_attribution(text, text) from public, anon, authenticated;
grant execute on function public.redeem_website_attribution(text, text) to service_role;
