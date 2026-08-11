-- Self-registration (email confirmation required) cannot insert into
-- hse_profiles from the client: right after auth.signUp() there is no
-- active session yet, so auth.uid() is null and the existing RLS policy
-- (auth.uid() = user_id or admin) rejects the insert. A security-definer
-- trigger on auth.users runs as the table owner and bypasses that RLS gap.
--
-- The role is read from raw_user_meta_data, which is fully attacker
-- controlled (anyone can call supabase.auth.signUp directly with any
-- payload) — so it is whitelisted here to 'employee' or 'specialist' only.
-- 'admin' can never be granted through self-registration.
create or replace function public.handle_new_hse_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := new.raw_user_meta_data->>'role';
  safe_role text := case
    when requested_role in ('employee', 'specialist') then requested_role
    else 'employee'
  end;
  department_slug text := new.raw_user_meta_data->>'department_slug';
  target_department record;
begin
  select id, organization_id
    into target_department
    from public.hse_departments
    where slug = department_slug
    limit 1;

  insert into public.hse_profiles (
    user_id, organization_id, department_id, email, full_name, role
  )
  values (
    new.id,
    target_department.organization_id,
    target_department.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    safe_role
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_hse_profile on auth.users;
create trigger on_auth_user_created_hse_profile
  after insert on auth.users
  for each row execute function public.handle_new_hse_user();
