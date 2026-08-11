create extension if not exists pgcrypto;

create table if not exists public.hse_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.hse_sites (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.hse_companies(id) on delete cascade,
  name text not null,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists public.hse_employees (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.hse_companies(id) on delete cascade,
  site_id uuid references public.hse_sites(id) on delete set null,
  full_name text not null,
  department text not null,
  role text not null,
  personnel_number text,
  created_at timestamptz not null default now()
);

create table if not exists public.hse_courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  version text not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hse_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.hse_courses(id) on delete cascade,
  title text not null,
  description text not null,
  estimated_minutes integer not null default 0,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.hse_cards (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.hse_modules(id) on delete cascade,
  title text not null,
  short_text text not null,
  rule_code text not null,
  risk_tag text not null,
  image_url text,
  alt_text text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.hse_questions (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.hse_modules(id) on delete cascade,
  question_text text not null,
  question_type text not null check (question_type in ('single', 'multi')),
  risk_tag text not null,
  related_rule_code text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.hse_question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.hse_questions(id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.hse_attempts (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references public.hse_employees(id) on delete set null,
  course_id uuid references public.hse_courses(id) on delete set null,
  module_id uuid references public.hse_modules(id) on delete set null,
  course_version text not null,
  attempt_number integer not null default 1,
  status text not null,
  score numeric(5,2) not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_seconds integer not null default 0
);

create table if not exists public.hse_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.hse_attempts(id) on delete cascade,
  question_id uuid references public.hse_questions(id) on delete set null,
  selected_option_ids jsonb not null default '[]'::jsonb,
  is_correct boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.hse_events (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references public.hse_employees(id) on delete set null,
  course_id uuid references public.hse_courses(id) on delete set null,
  module_id uuid references public.hse_modules(id) on delete set null,
  event_type text not null,
  event_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.hse_recommendations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.hse_companies(id) on delete cascade,
  site_id uuid references public.hse_sites(id) on delete set null,
  module_id uuid references public.hse_modules(id) on delete set null,
  risk_tag text not null,
  recommendation_text text not null,
  severity text not null default 'medium',
  created_at timestamptz not null default now()
);

create table if not exists public.hse_course_requests (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  industry text,
  employees_count integer,
  sites_text text,
  risk_types text,
  course_goal text,
  materials_description text,
  contact_name text not null,
  phone text,
  email text,
  comment text,
  files_metadata jsonb not null default '[]'::jsonb,
  crm_status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists hse_sites_company_id_idx on public.hse_sites(company_id);
create index if not exists hse_employees_company_id_idx on public.hse_employees(company_id);
create index if not exists hse_modules_course_id_idx on public.hse_modules(course_id);
create index if not exists hse_cards_module_id_idx on public.hse_cards(module_id);
create index if not exists hse_attempts_employee_id_idx on public.hse_attempts(employee_id);
create index if not exists hse_attempts_module_id_idx on public.hse_attempts(module_id);
create index if not exists hse_events_created_at_idx on public.hse_events(created_at desc);
create index if not exists hse_course_requests_created_at_idx on public.hse_course_requests(created_at desc);