import { getHseSupabaseClient, getHseSupabaseConfig } from './hseSupabase';

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

export const fetchDepartmentSlug = async (departmentId: string | null) => {
  if (!departmentId) return null;
  const client = getHseSupabaseClient();
  if (!client) return null;
  const { data } = await table(client, 'hse_departments')
    .select('slug')
    .eq('id', departmentId)
    .maybeSingle();
  return data?.slug || null;
};

// Course/lesson content (demoData.ts, foodProductionTrainingModules.ts) is
// static in the app bundle, keyed by the same string ids as
// hse_modules.module_key ('life-saving-rules', 'slips-and-falls',
// 'electrical-safety'). Only progress/attempts live in Supabase — there is
// no admin-editable course content model yet.
export const listModulesByKey = async () => {
  const client = getHseSupabaseClient();
  if (!client) return [];
  const { data, error } = await table(client, 'hse_modules').select(
    'id, module_key, title'
  );
  if (error) throw error;
  return (data || []) as { id: string; module_key: string; title: string }[];
};

const resolveModuleIdByKey = async (moduleKey: string) => {
  const client = getHseSupabaseClient();
  if (!client) return null;
  const { data } = await table(client, 'hse_modules')
    .select('id')
    .eq('module_key', moduleKey)
    .maybeSingle();
  return data?.id || null;
};

// Called from lib/storage.ts's saveAttempt so the localStorage-based demo
// flow transparently also persists to Supabase for a real, logged-in user —
// no-op in showcase mode where there is no session.
export const recordRealAttempt = async (attempt: {
  moduleId: string;
  moduleTitle?: string;
  version?: string;
  score: number;
  passed: boolean;
  status: string;
  attemptNumber?: number;
  durationSeconds?: number;
  completedAt?: string;
}) => {
  const client = getHseSupabaseClient();
  if (!client) return;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) return;

  const moduleId = await resolveModuleIdByKey(attempt.moduleId);
  await table(client, 'hse_attempts').insert({
    user_id: userId,
    module_id: moduleId,
    course_version: attempt.version || 'n/a',
    attempt_number: attempt.attemptNumber || 1,
    status: attempt.status,
    score: attempt.score,
    completed_at: attempt.completedAt || new Date().toISOString(),
    duration_seconds: attempt.durationSeconds || 0,
  });

  await logHseEvent('attempt_completed', {
    moduleKey: attempt.moduleId,
    moduleTitle: attempt.moduleTitle,
    score: attempt.score,
    passed: attempt.passed,
  });
};

export const listMyAttempts = async () => {
  const client = getHseSupabaseClient();
  if (!client) return [];
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) return [];
  const { data, error } = await table(client, 'hse_attempts')
    .select('id, module_id, status, score, completed_at')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const listAllAttempts = async () => {
  const client = requireClient();
  const { data, error } = await table(client, 'hse_attempts')
    .select('id, user_id, module_id, status, score, completed_at')
    .order('completed_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const updateOwnFullName = async (fullName: string) => {
  const client = requireClient();
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) throw new Error('Не найдена активная сессия.');
  const { error } = await table(client, 'hse_profiles')
    .update({ full_name: fullName, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
  if (error) throw error;
};

export const updateOwnPassword = async (newPassword: string) => {
  const client = requireClient();
  const { error } = await client.auth.updateUser({ password: newPassword });
  if (error) throw error;
};

// Supabase has no client-callable "delete my own account" API — deleting a
// user from auth.users requires the service-role key, which must never
// reach the frontend. This calls a dedicated Edge Function
// (supabase/functions/delete-account) that verifies the caller's own JWT
// server-side and only then deletes that same user with the service role.
export const deleteOwnAccount = async () => {
  const client = requireClient();
  const config = getHseSupabaseConfig();
  const { data: sessionData } = await client.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) throw new Error('Не найдена активная сессия.');

  const response = await fetch(`${config.url}/functions/v1/delete-account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      apikey: config.anonKey,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}) as any);
    throw new Error(body?.error || 'Не удалось удалить аккаунт.');
  }
  await client.auth.signOut();
};
