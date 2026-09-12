declare const Deno: any;
// @ts-ignore Deno explicit extension
import { sanitizeAttribution } from '../_shared/attribution.ts';
// @ts-ignore Deno explicit extension
import { database, env, hash, randomHex, readBody, reply, trustedOrigin } from '../_shared/attribution-server.ts';

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin') || '';
  if (!trustedOrigin(origin)) return reply({ error: 'origin_not_allowed' }, 403);
  if (req.method === 'OPTIONS') return reply(null, 204, origin);
  if (req.method !== 'POST') return reply({ error: 'method_not_allowed' }, 405, origin);
  try {
    const input = await readBody(req);
    // Enable only after the external bot implements the documented resolver.
    if (env('TELEGRAM_ATTRIBUTION_ENABLED') !== 'true') return reply({ enabled: false }, 200, origin);
    if (!['reserve', 'capture'].includes(input?.action)) return reply({ error: 'bad_action' }, 400, origin);
    const sb = await database();
    const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const quota = await sb.rpc('website_attribution_quota', { p_key: `telegram:${await hash(ip)}`, p_limit: 120, p_seconds: 3600 });
    if (quota.error || !quota.data) return reply({ error: 'rate_limited' }, 429, origin);
    if (input.action === 'reserve') {
      const token = randomHex(16), captureKey = randomHex(32);
      const { error } = await sb.from('website_attribution_tokens').insert({ token, capture_key_hash: await hash(captureKey) });
      if (error) throw new Error('storage_unavailable');
      return reply({ token, capture_key: captureKey }, 200, origin);
    }
    const snapshot = sanitizeAttribution(input.snapshot, 'telegram');
    if (!snapshot || !/^[a-f0-9]{32}$/.test(input.token) || !/^[a-f0-9]{64}$/.test(input.capture_key)) return reply({ error: 'invalid_capture' }, 400, origin);
    const { data, error } = await sb.from('website_attribution_tokens').update({
      attribution_snapshot: snapshot, visitor_id: snapshot.visitor_id, session_id: snapshot.session_id,
    }).eq('token', input.token).eq('capture_key_hash', await hash(input.capture_key))
      .gt('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()).is('attribution_snapshot', null).select('token');
    if (error) throw new Error('storage_unavailable');
    return reply({ ok: Boolean(data?.length) }, 200, origin);
  } catch { return reply({ error: 'attribution_unavailable' }, 503, origin); }
}
if (typeof Deno !== 'undefined' && Deno.serve) Deno.serve(handler);
