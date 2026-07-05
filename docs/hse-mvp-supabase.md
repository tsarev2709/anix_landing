# HSE MVP Supabase setup

The frontend reads Supabase settings from public anon-key environment variables only:

- `VITE_SUPABASE_URL` or `REACT_APP_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` or `REACT_APP_SUPABASE_ANON_KEY`
- `VITE_ALLOWED_EMAIL_DOMAINS` or `REACT_APP_ALLOWED_EMAIL_DOMAINS`
- `VITE_TEST_ADMIN_EMAIL` or `REACT_APP_TEST_ADMIN_EMAIL`

The service-role key must never be available in the frontend. Use it only in local scripts, CI secrets, or backend endpoints.

## Database

Apply migrations in order:

1. `supabase/migrations/001_hse_mvp.sql`
2. `supabase/migrations/002_hse_mvp_modes.sql`

Then load `supabase/seed.sql` for demo organization, departments, modules, lessons, and source documents.

## Files and CRM

The showcase form stores demo requests in `localStorage` when a CRM webhook is not configured. In a production contour, uploaded files should go to Supabase Storage or another protected storage service, and only metadata/URLs should be sent to CRM.

## No-env behavior

If Supabase variables are absent, `/hse/mvp/test` shows a setup checklist. `/hse/mvp/showcase` remains fully available on demo data.