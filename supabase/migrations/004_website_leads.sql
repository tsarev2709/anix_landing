create table if not exists public.website_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  idempotency_key text not null unique,
  name text not null,
  company text,
  email text,
  phone text,
  telegram text,
  contact_value text,
  contact_type text,
  message text not null,
  source text not null default 'website',
  status text not null default 'saved'
    check (status in ('received', 'turnstile_failed', 'saved', 'sent_to_amocrm', 'amocrm_error', 'completed')),
  page_url text,
  page_path text,
  page_title text,
  referrer text,
  initial_referrer text,
  landing_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  yclid text,
  gclid text,
  session_id text,
  session_started_at timestamptz,
  time_on_site_seconds integer not null default 0,
  pages_viewed_count integer not null default 0,
  pages_viewed jsonb not null default '[]'::jsonb,
  user_agent text,
  screen_width integer,
  screen_height integer,
  language text,
  timezone text,
  amocrm_account_id bigint,
  amocrm_lead_id bigint,
  amocrm_contact_id bigint,
  amocrm_pipeline_id bigint,
  amocrm_status_id bigint,
  integration_error text,
  sync_attempts integer not null default 0,
  last_sync_at timestamptz,
  payload jsonb not null default '{}'::jsonb,
  constraint website_leads_contact_type_check
    check (contact_type is null or contact_type in ('email', 'phone', 'telegram', 'multiple', '')),
  constraint website_leads_contact_present_check
    check (
      nullif(btrim(coalesce(email, '')), '') is not null
      or nullif(btrim(coalesce(contact_value, '')), '') is not null
    )
);

create index if not exists website_leads_status_created_idx
  on public.website_leads (status, created_at desc);
create index if not exists website_leads_email_idx
  on public.website_leads (lower(email))
  where email is not null and email <> '';
create index if not exists website_leads_phone_idx
  on public.website_leads (phone)
  where phone is not null and phone <> '';

alter table public.website_leads enable row level security;
revoke all on table public.website_leads from anon, authenticated;
grant all on table public.website_leads to service_role;

comment on table public.website_leads is
  'Server-written website enquiries with attribution and amoCRM delivery state.';
comment on column public.website_leads.payload is
  'Sanitized original request payload. Never contains Turnstile or CRM secrets.';
