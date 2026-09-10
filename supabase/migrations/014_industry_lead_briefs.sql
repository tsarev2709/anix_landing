-- Additive migration; public writes still go through the validated Edge Function.
alter table public.website_leads
  add column if not exists brief_crm_synced boolean,
  add column if not exists form_variant text,
  add column if not exists form_version text,
  add column if not exists brief jsonb,
  add column if not exists cta_id text,
  add column if not exists landing_variant text,
  add column if not exists metrika_client_id text;
create index if not exists website_leads_variant_created_idx on public.website_leads(form_variant, created_at desc);
