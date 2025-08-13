// Публичный ref — НЕ секрет. Нужен фолбэк, чтобы не было /undefined.
const PROJECT_REF = 'ppoygmaqlaiqcisjetea';
const FALLBACK_SUBMIT = `https://${PROJECT_REF}.functions.supabase.co/submit-lead`;
const FALLBACK_TRACK = `https://${PROJECT_REF}.functions.supabase.co/track-event`;

export const CONFIG = {
  SUBMIT_LEAD_URL: process.env.REACT_APP_SUBMIT_LEAD_URL || FALLBACK_SUBMIT,
  TRACK_EVENT_URL: process.env.REACT_APP_TRACK_EVENT_URL || FALLBACK_TRACK,
  TURNSTILE_SITE_KEY: process.env.REACT_APP_TURNSTILE_SITE_KEY || '',
  SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
};

export function assertConfig() {
  const missing: string[] = [];
  if (!process.env.REACT_APP_SUBMIT_LEAD_URL)
    missing.push('REACT_APP_SUBMIT_LEAD_URL');
  if (!process.env.REACT_APP_TRACK_EVENT_URL)
    missing.push('REACT_APP_TRACK_EVENT_URL');
  if (!CONFIG.TURNSTILE_SITE_KEY) missing.push('REACT_APP_TURNSTILE_SITE_KEY');
  if (missing.length)
    console.warn('[CFG] Using FALLBACK URLs. Missing:', missing.join(', '));
}
