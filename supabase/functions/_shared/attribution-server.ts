declare const Deno: any;
declare const process: any;
export function env(name: string): string {
  try { return typeof Deno !== 'undefined' ? Deno.env.get(name) || '' : process.env[name] || ''; } catch { return ''; }
}
export function serviceKey() { return env('SUPABASE_SERVICE_ROLE_KEY') || env('SB_SERVICE_ROLE_KEY'); }
export function trustedOrigin(origin: string) {
  return ['https://studio.anix-ai.pro', 'http://localhost:3000', 'http://127.0.0.1:3000', ...env('WEBSITE_LEAD_ALLOWED_ORIGINS').split(',')].includes(origin) && Boolean(origin);
}
export function reply(body: any, status = 200, origin = '') {
  return new Response(body === null ? null : JSON.stringify(body), { status, headers: {
    'Content-Type': 'application/json', 'Cache-Control': 'no-store', Vary: 'Origin',
    ...(trustedOrigin(origin) ? { 'Access-Control-Allow-Origin': origin } : {}),
    'Access-Control-Allow-Headers': 'content-type, authorization, apikey', 'Access-Control-Allow-Methods': 'POST,OPTIONS',
  } });
}
export async function readBody(req: Request, limit = 60000): Promise<any> {
  if (Number(req.headers.get('content-length')) > limit) throw new Error('payload_too_large');
  const body = await req.text();
  if (new TextEncoder().encode(body).length > limit) throw new Error('payload_too_large');
  return JSON.parse(body);
}
export async function database() {
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  return createClient(env('SUPABASE_URL') || env('SB_URL'), serviceKey(), { auth: { persistSession: false, autoRefreshToken: false } });
}
export async function hash(value: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), (v) => v.toString(16).padStart(2, '0')).join('');
}
export function randomHex(bytes: number) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (v) => v.toString(16).padStart(2, '0')).join('');
}
