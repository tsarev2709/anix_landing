import { CONFIG } from '../config';

function isSupabaseFn(url: string) {
  try {
    return new URL(url).host.endsWith('.functions.supabase.co');
  } catch {
    return false;
  }
}

function withAuthHeaders(h: Record<string, string> = {}) {
  const key = CONFIG.SUPABASE_ANON_KEY?.trim();
  if (!key) return h;
  return { ...h, Authorization: `Bearer ${key}`, apikey: key };
}

export async function postJson(
  url: string,
  body: any,
  extraHeaders: Record<string, string> = {}
) {
  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const headers = isSupabaseFn(url)
    ? withAuthHeaders({ ...baseHeaders, ...extraHeaders })
    : { ...baseHeaders, ...extraHeaders };

  const r = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  let data: any = null;
  try {
    data = await r.json();
  } catch {}
  if (!r.ok || (data && data.error)) {
    const err = new Error(data?.error || r.statusText);
    (err as any).detail = data?.detail;
    throw err;
  }
  return data;
}

export async function trackEvent(url: string | undefined, body: any) {
  if (!url) return;
  try {
    await postJson(url, body);
  } catch {}
}
