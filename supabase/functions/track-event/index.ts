const ORIGIN = 'https://studio.anix-ai.pro';
const CORS = {
  'Access-Control-Allow-Origin': ORIGIN,
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

const allowedEvents = [
  'form_view',
  'form_start',
  'form_submit',
  'form_error',
  'section_transition',
  'cta_view',
  'cta_click',
];

async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  try {
    const { event, leadId, meta } = await req.json();
    if (!allowedEvents.includes(event)) {
      return json({ error: 'bad_event' }, 400);
    }

    const SB_URL = Deno.env.get('SB_URL') || process.env.SB_URL;
    const SB_SERVICE_ROLE_KEY =
      Deno.env.get('SB_SERVICE_ROLE_KEY') || process.env.SB_SERVICE_ROLE_KEY;
    if (!SB_URL || !SB_SERVICE_ROLE_KEY) return json({ error: 'misconfigured' }, 500);

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const sb = createClient(SB_URL, SB_SERVICE_ROLE_KEY);
    const ip =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('cf-connecting-ip') ||
      '';
    const ua = req.headers.get('user-agent') || '';

    const { error } = await sb.from('lead_events').insert({
      event_name: event,
      lead_id: leadId || null,
      meta: meta || null,
      ip,
      ua,
    });
    if (error) return json({ error: 'Database error' }, 500);

    return json({ ok: true });
  } catch (err) {
    return json({ error: 'Unexpected error' }, 500);
  }
}

if (typeof Deno !== 'undefined' && typeof (Deno as any).serve === 'function') {
  (Deno as any).serve(handler);
}
export default handler;
