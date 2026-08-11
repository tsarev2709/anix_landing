import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.HSE_ADMIN_EMAIL || process.env.VITE_TEST_ADMIN_EMAIL || process.env.REACT_APP_TEST_ADMIN_EMAIL;
const adminPassword = process.env.HSE_ADMIN_PASSWORD;
const adminName = process.env.HSE_ADMIN_NAME || 'HSE test admin';

const required = [
  ['SUPABASE_URL', supabaseUrl],
  ['SUPABASE_SERVICE_ROLE_KEY', serviceRoleKey],
  ['HSE_ADMIN_EMAIL', adminEmail],
  ['HSE_ADMIN_PASSWORD', adminPassword],
];

const missing = required.filter(([, value]) => !value).map(([key]) => key);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
  email: adminEmail,
  password: adminPassword,
  email_confirm: true,
  user_metadata: {
    full_name: adminName,
    hse_role: 'admin',
  },
});

let userId = createdUser?.user?.id;
if (createError) {
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) throw listError;
  const existing = users.users.find((user) => user.email === adminEmail);
  if (!existing) throw createError;
  userId = existing.id;
  const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
    password: adminPassword,
    email_confirm: true,
    user_metadata: {
      ...existing.user_metadata,
      full_name: existing.user_metadata?.full_name || adminName,
      hse_role: 'admin',
    },
  });
  if (updateError) throw updateError;
}

const { data: organization } = await supabase
  .from('hse_organizations')
  .select('id')
  .order('created_at', { ascending: true })
  .limit(1)
  .maybeSingle();

const { error: profileError } = await supabase.from('hse_profiles').upsert(
  {
    user_id: userId,
    organization_id: organization?.id || null,
    email: adminEmail,
    full_name: adminName,
    role: 'admin',
    updated_at: new Date().toISOString(),
  },
  { onConflict: 'user_id' }
);

if (profileError) throw profileError;

console.log(`HSE admin is ready: ${adminEmail}`);