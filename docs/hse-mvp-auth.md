# HSE MVP auth and roles

## Roles

The test contour is designed around three roles:

- `employee`: sees assigned modules, own progress, own attempts, and own confirmations.
- `specialist`: sees organization/department analytics, employee progress, errors, recommendations, and exports.
- `admin`: manages organizations, departments, modules, users, versions, integrations, and course requests.

## Registration

Self-registration (`/hse/mvp/test/register`) uses Supabase Auth with allowed corporate email domains from `VITE_ALLOWED_EMAIL_DOMAINS` or `REACT_APP_ALLOWED_EMAIL_DOMAINS`.

The registrant picks their own role, but the choice is limited to `employee` and `specialist` — `admin` is never offered on the self-registration form. This is a deliberate security boundary: anyone who can reach the form must not be able to grant themselves administrator access. `admin` accounts are created only via `scripts/create-hse-admin.mjs` or promoted from the admin dashboard by an existing admin.

The frontend may validate email domains for UX, but backend/Supabase policies (RLS) remain the enforcement layer.

Email confirmation is disabled for this contour (`Authentication` → `Email` → "Confirm email" off in the Supabase dashboard), so `supabase.auth.signUp` returns an active session immediately and the user lands in their role's dashboard without checking their inbox.

## Admin creation

Admin passwords are not stored in frontend code or frontend environment variables. Create a test admin with:

```bash
SUPABASE_URL="https://..." \
SUPABASE_SERVICE_ROLE_KEY="..." \
HSE_ADMIN_EMAIL="hse-admin@example.com" \
HSE_ADMIN_PASSWORD="strong-password" \
node scripts/create-hse-admin.mjs
```

The script creates or updates a Supabase Auth user and upserts the related `hse_profiles` row with role `admin`.

## RLS

`002_hse_mvp_modes.sql` enables row-level security for the HSE test contour tables and adds starter policies for own-profile access, specialist/admin analytics access, and public read access to published learning materials for authenticated users.