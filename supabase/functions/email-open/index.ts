import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
const PNG_BASE64="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAukB9oK9E2wAAAAASUVORK5CYII="; // 1x1 прозрачный png
serve(async (req)=>{
  const url = new URL(req.url);
  const lead_id = url.searchParams.get('lead_id') ?? undefined;
  try {
    // лог в lead_events (не забывай createClient)
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    await sb.from('lead_events').insert({
      event_name:'email_open', lead_id, meta:{ t: Date.now() },
      ip: req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? null,
      ua: req.headers.get('user-agent') ?? null
    });
  } catch {}
  return new Response(Uint8Array.from(atob(PNG_BASE64), c=>c.charCodeAt(0)), {
    headers:{ "Content-Type":"image/png", "Cache-Control":"no-store" }
  });
});
