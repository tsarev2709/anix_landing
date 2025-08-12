import { createClient } from '@supabase/supabase-js';

const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';

export default async function handler(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const leadId = url.searchParams.get('lead_id');
    if (!leadId) {
      return new Response('Missing lead_id', { status: 400 });
    }
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || process.env.SUPABASE_URL;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || '';
    const ua = req.headers.get('user-agent') || '';
    await supabase.from('lead_events').insert({
      event_name: 'email_open',
      lead_id: leadId,
      meta: { t: new Date().toISOString() },
      ip,
      ua,
    });
    const body = Uint8Array.from(atob(pngBase64), c => c.charCodeAt(0));
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    return new Response('error', { status: 500 });
  }
}
