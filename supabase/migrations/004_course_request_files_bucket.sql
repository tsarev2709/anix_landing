-- Storage bucket for "Заказать новый курс" attachments (see
-- uploadCourseRequestFiles in src/features/hseMvp/lib/crm.ts and
-- supabase/functions/submit-course-request). Public bucket so the
-- specialist can open the file straight from the amoCRM note; object
-- paths include a timestamp + random suffix, so they aren't guessable or
-- listed anywhere public.
insert into storage.buckets (id, name, public)
values ('course-request-files', 'course-request-files', true)
on conflict (id) do nothing;

-- Anonymous visitors fill this form without a session, so anon needs
-- insert access. No update/delete policy is granted — uploads are
-- write-once from the form.
create policy "Anon can upload course request files"
on storage.objects for insert
to anon
with check (bucket_id = 'course-request-files');
