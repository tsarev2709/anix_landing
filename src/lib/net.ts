import { CONFIG } from '@/config';

function isSupabaseFn(url: string) {
  try {
    return new URL(url).hostname.endsWith('.functions.supabase.co');
  } catch {
    return false;
  }
}

export async function postJson(url: string, body: any) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (isSupabaseFn(url) && CONFIG.SUPABASE_ANON_KEY) {
    headers['Authorization'] = `Bearer ${CONFIG.SUPABASE_ANON_KEY}`;
    headers['apikey'] = CONFIG.SUPABASE_ANON_KEY;
  }
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
    const err: any = new Error(data?.error || r.statusText);
    err.detail = data?.detail;
    err.code = r.status;
    throw err;
  }
  return data;
}
