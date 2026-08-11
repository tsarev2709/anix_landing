import { CORS } from '../_shared/cors.ts';

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAukB9oK9E2wAAAAASUVORK5CYII='; // 1x1 прозрачный png

async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  const SB_URL = Deno.env.get('SB_URL');
  const SB_SERVICE_ROLE_KEY = Deno.env.get('SB_SERVICE_ROLE_KEY');

  if (!SB_URL || !SB_SERVICE_ROLE_KEY) {
    return json({ error: 'misconfigured' }, 500);
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
        ...CORS,
      },
    }
  );
}

if (typeof Deno !== 'undefined' && typeof (Deno as any).serve === 'function') {
  (Deno as any).serve(handler);
}
export default handler;
