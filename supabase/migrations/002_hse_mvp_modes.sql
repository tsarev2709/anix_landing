create extension if not exists pgcrypto;

create table if not exists public.hse_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  created_at timestamptz not null default now()
);

create table if not exists public.hse_departments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.hse_organizations(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  headcount integer not null default 0,
  created_at timestamptz not null default now(),
  unique (organization_id, slug)
);

alter table public.hse_employees
  add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.hse_modules
  add column if not exists module_key text;

alter table public.hse_attempts
  add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.hse_events
  add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.hse_course_requests
  add column if not exists created_by uuid references auth.users(id) on delete set null;

create unique index if not exists hse_modules_module_key_idx
  on public.hse_modules(module_key)
  where module_key is not null;

create table if not exists public.hse_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references public.hse_organizations(id) on delete set null,
  department_id uuid references public.hse_departments(id) on delete set null,
  email text,
  full_name text,
  role text not null default 'employee' check (role in ('employee', 'specialist', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hse_source_documents (
  id text primary key,
  title text not null,
  document_type text not null check (document_type in ('law', 'order', 'gost', 'sp', 'internal')),
  description text,
  url text,
  created_at timestamptz not null default now()
);

create table if not exists public.hse_department_modules (
  department_id uuid not null references public.hse_departments(id) on delete cascade,
  module_key text not null,
  required boolean not null default true,
  due_days integer,
  created_at timestamptz not null default now(),
  primary key (department_id, module_key)
);

create table if not exists public.hse_lessons (
  id uuid primary key default gen_random_uuid(),
  module_key text not null,
  lesson_key text not null,
  lesson_type text not null check (lesson_type in ('video_card', 'text_lesson', 'interactive_question')),
  title text not null,
  body text,
  payload jsonb not null default '{}'::jsonb,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  unique (module_key, lesson_key)
);

create table if not exists public.hse_lesson_sources (
  lesson_id uuid not null references public.hse_lessons(id) on delete cascade,
  source_id text not null references public.hse_source_documents(id) on delete restrict,
  primary key (lesson_id, source_id)
);

create index if not exists hse_departments_organization_id_idx on public.hse_departments(organization_id);
create index if not exists hse_profiles_organization_id_idx on public.hse_profiles(organization_id);
create index if not exists hse_profiles_role_idx on public.hse_profiles(role);
create index if not exists hse_lessons_module_key_idx on public.hse_lessons(module_key, order_index);
create index if not exists hse_department_modules_module_key_idx on public.hse_department_modules(module_key);
create index if not exists hse_employees_user_id_idx on public.hse_employees(user_id);
create index if not exists hse_attempts_user_id_idx on public.hse_attempts(user_id);

create or replace function public.hse_current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.hse_profiles where user_id = auth.uid() limit 1
$$;

create or replace function public.hse_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.hse_current_role() = 'admin', false)
$$;

create or replace function public.hse_is_specialist_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.hse_current_role() in ('specialist', 'admin'), false)
$$;

alter table public.hse_organizations enable row level security;
alter table public.hse_departments enable row level security;
alter table public.hse_profiles enable row level security;
alter table public.hse_source_documents enable row level security;
alter table public.hse_department_modules enable row level security;
alter table public.hse_lessons enable row level security;
alter table public.hse_lesson_sources enable row level security;
alter table public.hse_courses enable row level security;
alter table public.hse_modules enable row level security;
alter table public.hse_cards enable row level security;
alter table public.hse_questions enable row level security;
alter table public.hse_question_options enable row level security;
alter table public.hse_attempts enable row level security;
alter table public.hse_answers enable row level security;
alter table public.hse_events enable row level security;
alter table public.hse_recommendations enable row level security;
alter table public.hse_course_requests enable row level security;

drop policy if exists hse_profiles_select on public.hse_profiles;
create policy hse_profiles_select on public.hse_profiles
  for select using (auth.uid() = user_id or public.hse_is_specialist_or_admin());

drop policy if exists hse_profiles_insert_own on public.hse_profiles;
create policy hse_profiles_insert_own on public.hse_profiles
  for insert with check (auth.uid() = user_id or public.hse_is_admin());

drop policy if exists hse_profiles_update_own on public.hse_profiles;
create policy hse_profiles_update_own on public.hse_profiles
  for update using (auth.uid() = user_id or public.hse_is_admin())
  with check (auth.uid() = user_id or public.hse_is_admin());

drop policy if exists hse_read_learning_materials on public.hse_courses;
create policy hse_read_learning_materials on public.hse_courses for select using (true);
drop policy if exists hse_read_modules on public.hse_modules;
create policy hse_read_modules on public.hse_modules for select using (true);
drop policy if exists hse_read_cards on public.hse_cards;
create policy hse_read_cards on public.hse_cards for select using (true);
drop policy if exists hse_read_questions on public.hse_questions;
create policy hse_read_questions on public.hse_questions for select using (true);
drop policy if exists hse_read_options on public.hse_question_options;
create policy hse_read_options on public.hse_question_options for select using (true);
drop policy if exists hse_read_sources on public.hse_source_documents;
create policy hse_read_sources on public.hse_source_documents for select using (true);
drop policy if exists hse_read_lessons on public.hse_lessons;
create policy hse_read_lessons on public.hse_lessons for select using (true);
drop policy if exists hse_read_lesson_sources on public.hse_lesson_sources;
create policy hse_read_lesson_sources on public.hse_lesson_sources for select using (true);

drop policy if exists hse_org_select on public.hse_organizations;
create policy hse_org_select on public.hse_organizations for select using (public.hse_is_specialist_or_admin());
drop policy if exists hse_org_admin_write on public.hse_organizations;
create policy hse_org_admin_write on public.hse_organizations for all using (public.hse_is_admin()) with check (public.hse_is_admin());

drop policy if exists hse_departments_select on public.hse_departments;
create policy hse_departments_select on public.hse_departments for select using (public.hse_is_specialist_or_admin());
drop policy if exists hse_departments_admin_write on public.hse_departments;
create policy hse_departments_admin_write on public.hse_departments for all using (public.hse_is_admin()) with check (public.hse_is_admin());

drop policy if exists hse_department_modules_select on public.hse_department_modules;
create policy hse_department_modules_select on public.hse_department_modules for select using (public.hse_is_specialist_or_admin());
drop policy if exists hse_department_modules_admin_write on public.hse_department_modules;
create policy hse_department_modules_admin_write on public.hse_department_modules for all using (public.hse_is_admin()) with check (public.hse_is_admin());

drop policy if exists hse_attempts_select on public.hse_attempts;
create policy hse_attempts_select on public.hse_attempts
  for select using (
    user_id = auth.uid()
    or public.hse_is_specialist_or_admin()
    or exists (
      select 1 from public.hse_employees employee
      where employee.id = hse_attempts.employee_id and employee.user_id = auth.uid()
    )
  );

drop policy if exists hse_attempts_insert_own on public.hse_attempts;
create policy hse_attempts_insert_own on public.hse_attempts
  for insert with check (user_id = auth.uid() or public.hse_is_specialist_or_admin());

drop policy if exists hse_attempts_update_own on public.hse_attempts;
create policy hse_attempts_update_own on public.hse_attempts
  for update using (user_id = auth.uid() or public.hse_is_specialist_or_admin())
  with check (user_id = auth.uid() or public.hse_is_specialist_or_admin());

drop policy if exists hse_answers_select on public.hse_answers;
create policy hse_answers_select on public.hse_answers
  for select using (
    public.hse_is_specialist_or_admin()
    or exists (
      select 1 from public.hse_attempts attempt
      where attempt.id = hse_answers.attempt_id and attempt.user_id = auth.uid()
    )
  );

drop policy if exists hse_answers_insert_own on public.hse_answers;
create policy hse_answers_insert_own on public.hse_answers
  for insert with check (
    public.hse_is_specialist_or_admin()
    or exists (
      select 1 from public.hse_attempts attempt
      where attempt.id = hse_answers.attempt_id and attempt.user_id = auth.uid()
    )
  );

drop policy if exists hse_events_insert on public.hse_events;
create policy hse_events_insert on public.hse_events for insert with check (user_id = auth.uid() or user_id is null);
drop policy if exists hse_events_select on public.hse_events;
create policy hse_events_select on public.hse_events for select using (user_id = auth.uid() or public.hse_is_specialist_or_admin());

drop policy if exists hse_recommendations_select on public.hse_recommendations;
create policy hse_recommendations_select on public.hse_recommendations for select using (public.hse_is_specialist_or_admin());
drop policy if exists hse_recommendations_admin_write on public.hse_recommendations;
create policy hse_recommendations_admin_write on public.hse_recommendations for all using (public.hse_is_admin()) with check (public.hse_is_admin());

drop policy if exists hse_course_requests_insert on public.hse_course_requests;
create policy hse_course_requests_insert on public.hse_course_requests for insert with check (true);
drop policy if exists hse_course_requests_select on public.hse_course_requests;
create policy hse_course_requests_select on public.hse_course_requests for select using (created_by = auth.uid() or public.hse_is_specialist_or_admin());
drop policy if exists hse_course_requests_admin_update on public.hse_course_requests;
create policy hse_course_requests_admin_update on public.hse_course_requests for update using (public.hse_is_admin()) with check (public.hse_is_admin());