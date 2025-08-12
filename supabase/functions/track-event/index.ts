const allowedEvents = [
  'form_view',
  'form_start',
  'form_submit',
  'email_open',
  'section_transition',
  'cta_view',
  'cta_click',
];

const ALLOW_ORIGIN = 'https://studio.anix-ai.pro';
const cors = {
  'Access-Control-Allow-Origin': ALLOW_ORIGIN,
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS,GET',
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { event, leadId, meta } = await req.json();
    if (!allowedEvents.includes(event)) {
      return new Response(JSON.stringify({ error: 'Unknown event' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const SB_URL = Deno.env.get('SB_URL') || process.env.SB_URL;
    const SB_SERVICE_ROLE_KEY =
      Deno.env.get('SB_SERVICE_ROLE_KEY') || process.env.SB_SERVICE_ROLE_KEY;

    if (!SB_URL || !SB_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'misconfigured' }), {
        status: 500,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const { createClient } = await import(
      'https://esm.sh/@supabase/supabase-js@2'
    );
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
    if (error) {
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Unexpected error' }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
}
