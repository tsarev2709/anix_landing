// Публичный ref — НЕ секрет. Нужен фолбэк, чтобы не было /undefined.
const PROJECT_REF = 'ppoygmaqlaiqcisjetea';
const FALLBACK_SUBMIT = `https://${PROJECT_REF}.functions.supabase.co/submit-lead`;
const FALLBACK_TRACK = `https://${PROJECT_REF}.functions.supabase.co/track-event`;

export const CONFIG = {
  SUBMIT_LEAD_URL: process.env.REACT_APP_SUBMIT_LEAD_URL || FALLBACK_SUBMIT,
  TRACK_EVENT_URL: process.env.REACT_APP_TRACK_EVENT_URL || FALLBACK_TRACK,
  SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
};

export function assertConfig() {
  const missing: string[] = [];
  if (!process.env.REACT_APP_SUBMIT_LEAD_URL)
    missing.push('REACT_APP_SUBMIT_LEAD_URL');
  if (!process.env.REACT_APP_TRACK_EVENT_URL)
    missing.push('REACT_APP_TRACK_EVENT_URL');
  if (missing.length)
    console.warn('[CFG] Using FALLBACK URLs. Missing:', missing.join(', '));
  if (!CONFIG.SUPABASE_ANON_KEY)
    console.warn('[CFG] Missing REACT_APP_SUPABASE_ANON_KEY');
}
