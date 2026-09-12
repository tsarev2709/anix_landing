import { CORS } from '../_shared/cors.ts';
// @ts-ignore Deno explicit extension
import { sanitizeAttribution, marketingValue, safePage } from '../_shared/attribution.ts';

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

const allowedEvents = [
  'page_view', 'showreel_open', 'case_open', 'pricing_view', 'telegram_click', 'email_click', 'form_success',
  'llm_open', 'llm_message', 'llm_lead', 'lead_form_view', 'lead_form_details_open',
  'cta_telegram', 'cta_email', 'navigate_medicine', 'navigate_hse', 'open_case', 'view_cases',
  'ai_chat_feedback', 'ai_chat_handoff_open', 'ai_chat_handoff_submit',
  'form_view',
  'form_start',
  'form_submit',
  'form_error',
  'section_transition',
  'cta_view',
  'cta_click',
  'ai_chat_open',
  'ai_chat_message',
  'ai_chat_fallback',
  'ai_chat_lead',
];

async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).length > 60000) return json({ error: 'payload_too_large' }, 413);
    const { event, leadId, meta, event_id } = JSON.parse(raw);
    if (!allowedEvents.includes(event)) {
      return json({ error: 'bad_event' }, 400);
    }

    const SB_URL = Deno.env.get('SUPABASE_URL') || Deno.env.get('SB_URL') || process.env.SB_URL;
    const SB_SERVICE_ROLE_KEY =
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SB_SERVICE_ROLE_KEY') || process.env.SB_SERVICE_ROLE_KEY;
    if (!SB_URL || !SB_SERVICE_ROLE_KEY)
      return json({ error: 'misconfigured' }, 500);

    const { createClient } =
      await import('https://esm.sh/@supabase/supabase-js@2');
    const sb = createClient(SB_URL, SB_SERVICE_ROLE_KEY);
    const ip =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('cf-connecting-ip') ||
      '';
    const ua = req.headers.get('user-agent') || '';

    const snapshot = sanitizeAttribution(meta?.attribution_snapshot);
    const cleanMeta: any = { path: safePage(meta?.path || meta?.page_path), timestamp: new Date().toISOString() };
    for (const key of ['form_variant', 'form_version', 'cta_id', 'formId', 'error_type', 'task_id', 'section', 'reason', 'rating', 'from', 'to']) {
      if (typeof meta?.[key] === 'string') cleanMeta[key] = marketingValue(meta[key]);
    }
    if (snapshot) cleanMeta.attribution_snapshot = snapshot;
    const { error } = await sb.from('lead_events').insert({
      event_id: typeof event_id === 'string' && /^[a-zA-Z0-9_-]{12,128}$/.test(event_id) ? event_id : null,
      visitor_id: snapshot?.visitor_id || null, session_id: snapshot?.session_id || null,
      event_name: event,
      lead_id: leadId || null,
      meta: cleanMeta,
      ip,
      ua,
    });
    if (error && error.code !== '23505') return json({ error: 'Database error' }, 500);

    return json({ ok: true });
  } catch (err) {
    return json({ error: 'Unexpected error' }, 500);
  }
}

if (typeof Deno !== 'undefined' && typeof (Deno as any).serve === 'function') {
  (Deno as any).serve(handler);
}
export default handler;
