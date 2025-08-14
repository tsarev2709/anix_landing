import { CONFIG } from '../config';

function isSupabaseFn(url: string) {
  try {
    return new URL(url).host.endsWith('.functions.supabase.co');
  } catch {
    return false;
  }
}

function withAuthHeaders(h: Record<string, string> = {}) {
  const key = (CONFIG.SUPABASE_ANON_KEY || '').trim();
  if (!key) return h;
  return { ...h, Authorization: `Bearer ${key}`, apikey: key };
}

export async function postJson(
  url: string,
  body: any,
  extraHeaders: Record<string, string> = {}
) {
  const base: Record<string, string> = { 'Content-Type': 'application/json' };
  const headers = isSupabaseFn(url)
    ? withAuthHeaders({ ...base, ...extraHeaders })
    : { ...base, ...extraHeaders };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  // Пытаемся распарсить JSON; если не получилось — читаем как текст
  let data: any = null;
  let text: string | null = null;
  try {
    data = await res.clone().json();
  } catch (e) {
    // Ответ не JSON — ок, попробуем текст (для 4xx/5xx пригодится в detail)
    try {
      text = await res.text();
    } catch (_e) {
      /* no body available */
    }
  }

  const hasApiError =
    data && typeof data === 'object' && 'error' in data && data.error;
  if (!res.ok || hasApiError) {
    const err = new Error((data && data.error) || res.statusText);
    (err as any).detail = (data && data.detail) || text || '';
    throw err;
  }
  return data ?? text;
}

export async function trackEvent(url: string, evt: any) {
  try {
    await postJson(url, { ...evt, ts: new Date().toISOString() });
  } catch (e) {
    // best-effort: в проде молчим, в dev помогаем дебажить
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[trackEvent] failed', e);
    }
  }
}
