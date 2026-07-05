# HSE MVP auth and roles

## Roles

The test contour is designed around three roles:

- `employee`: sees assigned modules, own progress, own attempts, and own confirmations.
- `specialist`: sees organization/department analytics, employee progress, errors, recommendations, and exports.
- `admin`: manages organizations, departments, modules, users, versions, integrations, and course requests.

## Registration

Employee self-registration should use Supabase Auth with allowed corporate email domains from `VITE_ALLOWED_EMAIL_DOMAINS` or `REACT_APP_ALLOWED_EMAIL_DOMAINS`.

The frontend may validate email domains for UX, but backend/Supabase policies remain the enforcement layer.

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