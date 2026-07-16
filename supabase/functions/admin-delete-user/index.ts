// Self-contained on purpose (no shared imports) — deployable either via
// the Supabase CLI or by pasting straight into the Dashboard's editor,
// same as delete-account/index.ts.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, authorization, x-client-info, apikey',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (!token) return json({ error: 'missing_token' }, 401);

    const { targetUserId } = await req.json();
    if (!targetUserId) return json({ error: 'missing_target_user_id' }, 400);

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return json({ error: 'misconfigured' }, 500);

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Resolve the caller's own identity from their JWT, then check their
    // role server-side — never trust a client-supplied "I am admin" claim.
    const { data: callerData, error: callerError } = await admin.auth.getUser(token);
    if (callerError || !callerData?.user) return json({ error: 'invalid_session' }, 401);

    const { data: callerProfile, error: profileError } = await admin
      .from('hse_profiles')
      .select('role')
      .eq('user_id', callerData.user.id)
      .maybeSingle();
    if (profileError) return json({ error: 'profile_lookup_failed' }, 500);
    if (callerProfile?.role !== 'admin') return json({ error: 'forbidden' }, 403);

    const { error: deleteError } = await admin.auth.admin.deleteUser(targetUserId);
    if (deleteError) return json({ error: 'delete_failed' }, 500);

    return json({ ok: true });
  } catch (_err) {
    return json({ error: 'unexpected_error' }, 500);
  }
}

if (typeof Deno !== 'undefined' && typeof (Deno as any).serve === 'function') {
  (Deno as any).serve(handler);
}
export default handler;
