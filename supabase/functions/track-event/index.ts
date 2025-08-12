import { createClient } from '@supabase/supabase-js';

const allowedEvents = ['form_view', 'form_start', 'form_submit'];

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') || process.env.ALLOWED_ORIGIN || '';
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (origin !== allowedOrigin) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  try {
    const { event, leadId, meta } = await req.json();
    if (!allowedEvents.includes(event)) {
      return new Response(JSON.stringify({ error: 'Unknown event' }), { status: 400, headers });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || process.env.SUPABASE_URL;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || '';
    const ua = req.headers.get('user-agent') || '';

    const { error } = await supabase.from('lead_events').insert({
      event_name: event,
      lead_id: leadId || null,
      meta: meta || null,
      ip,
      ua,
    });
    if (error) {
      return new Response(JSON.stringify({ error: 'Database error' }), { status: 500, headers });
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 500, headers });
  }
}
