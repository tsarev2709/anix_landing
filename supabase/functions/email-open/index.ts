import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const ALLOW_ORIGIN = 'https://studio.anix-ai.pro';
const cors = {
  'Access-Control-Allow-Origin': ALLOW_ORIGIN,
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS,GET',
};

const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAukB9oK9E2wAAAAASUVORK5CYII='; // 1x1 прозрачный png

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  const SB_URL = Deno.env.get('SB_URL');
  const SB_SERVICE_ROLE_KEY = Deno.env.get('SB_SERVICE_ROLE_KEY');

  if (!SB_URL || !SB_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'misconfigured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  }

  const url = new URL(req.url);
  const lead_id = url.searchParams.get('lead_id') ?? undefined;

  try {
    const { createClient } = await import(
      'https://esm.sh/@supabase/supabase-js@2'
    );
    const sb = createClient(SB_URL, SB_SERVICE_ROLE_KEY);
    await sb.from('lead_events').insert({
      event_name: 'email_open',
      lead_id,
      meta: { t: Date.now() },
      ip:
        req.headers.get('cf-connecting-ip') ??
        req.headers.get('x-forwarded-for') ??
        null,
      ua: req.headers.get('user-agent') ?? null,
    });
  } catch {}

  return new Response(
    Uint8Array.from(atob(PNG_BASE64), (c) => c.charCodeAt(0)),
    {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store',
        ...cors,
      },
    }
  );
});
