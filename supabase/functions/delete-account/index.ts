import { CORS } from '../_shared/cors.ts';

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

    // These are injected automatically for every deployed Edge Function —
    // no manual secret setup needed.
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return json({ error: 'misconfigured' }, 500);

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Resolves the caller's own identity from their JWT — a user can only
    // ever delete themselves, never an id they pass in.
    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData?.user) return json({ error: 'invalid_session' }, 401);

    const { error: deleteError } = await admin.auth.admin.deleteUser(userData.user.id);
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
