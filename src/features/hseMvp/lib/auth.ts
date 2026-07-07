import { getHseSupabaseClient } from './hseSupabase';

export type HseRole = 'employee' | 'specialist' | 'admin';

export const SELF_REGISTER_ROLES: { value: HseRole; label: string }[] = [
  { value: 'employee', label: 'Сотрудник' },
  { value: 'specialist', label: 'Специалист по охране труда' },
];

const requireClient = () => {
  const client = getHseSupabaseClient();
  if (!client) throw new Error('Supabase client is not configured');
  return client;
};

// The project has no generated Supabase Database types, so `.from()` falls
// back to overly strict generic inference on some toolchains. Casting to
// `any` here keeps table access permissive without adding a types file.
const table = (client: ReturnType<typeof requireClient>, name: string): any =>
  (client as any).from(name);

export const logHseEvent = async (eventType: string, payload: unknown = {}) => {
  const client = getHseSupabaseClient();
  if (!client) return;
  const { data: userData } = await client.auth.getUser();
  await table(client, 'hse_events').insert({
    user_id: userData?.user?.id || null,
    event_type: eventType,
    event_payload: payload,
  });
};

// The hse_profiles row is created server-side by the
// on_auth_user_created_hse_profile trigger (see
// supabase/migrations/003_hse_mvp_signup_trigger.sql), not from here.
// Right after signUp() there is no session yet when email confirmation is
// required, so the client has no auth.uid() and RLS would reject a direct
// insert. Metadata passed via `options.data` is what the trigger reads —
// note it is attacker-controlled input, so the trigger whitelists the role
// server-side rather than trusting it outright.
export const signUpWithProfile = async ({
  email,
  password,
  fullName,
  role,
  departmentSlug,
}: {
  email: string;
  password: string;
  fullName: string;
  role: HseRole;
  departmentSlug: string;
}) => {
  const client = requireClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
        department_slug: departmentSlug,
      },
    },
  });
  if (error) throw error;

  if (data.session) {
    await logHseEvent('user_registered', { role, departmentSlug });
  }
  return data;
};

export const signInWithPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const client = requireClient();
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  await logHseEvent('user_login', {});
  return data;
};

export const signOutCurrentUser = async () => {
  const client = getHseSupabaseClient();
  if (!client) return;
  await client.auth.signOut();
};

export const getCurrentSession = async () => {
  const client = getHseSupabaseClient();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data.session || null;
};

export const fetchOwnProfile = async () => {
  const client = getHseSupabaseClient();
  if (!client) return null;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) return null;
  const { data, error } = await table(client, 'hse_profiles')
    .select(
      'user_id, email, full_name, role, organization_id, department_id, created_at'
    )
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const listAllProfiles = async () => {
  const client = requireClient();
  const { data, error } = await table(client, 'hse_profiles')
    .select(
      'user_id, email, full_name, role, organization_id, department_id, created_at'
    )
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const listRecentEvents = async (limit = 50) => {
  const client = requireClient();
  const { data, error } = await table(client, 'hse_events')
    .select('id, user_id, event_type, event_payload, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
};

export const updateProfileRole = async (userId: string, role: HseRole) => {
  const client = requireClient();
  const { error } = await table(client, 'hse_profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
  if (error) throw error;
};
