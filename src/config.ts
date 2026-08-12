// Публичный ref — НЕ секрет. Нужен фолбэк, чтобы не было /undefined.
const PROJECT_REF = 'ppoygmaqlaiqcisjetea';
const FALLBACK_SUBMIT = `https://${PROJECT_REF}.functions.supabase.co/submit-lead`;
const FALLBACK_WEBSITE_LEAD = `https://${PROJECT_REF}.functions.supabase.co/submit-website-lead`;
const FALLBACK_TRACK = `https://${PROJECT_REF}.functions.supabase.co/track-event`;
const FALLBACK_AI_CHAT = `https://${PROJECT_REF}.functions.supabase.co/ai-chat`;

export const CONFIG = {
  SUBMIT_LEAD_URL: process.env.REACT_APP_SUBMIT_LEAD_URL || FALLBACK_SUBMIT,
  WEBSITE_LEAD_URL:
    process.env.REACT_APP_WEBSITE_LEAD_URL || FALLBACK_WEBSITE_LEAD,
  TRACK_EVENT_URL: process.env.REACT_APP_TRACK_EVENT_URL || FALLBACK_TRACK,
  AI_CHAT_URL: process.env.REACT_APP_AI_CHAT_URL || FALLBACK_AI_CHAT,
  TURNSTILE_SITE_KEY: process.env.REACT_APP_TURNSTILE_SITE_KEY || '',
  SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
};

export function assertConfig() {
  const missing: string[] = [];
  if (!process.env.REACT_APP_SUBMIT_LEAD_URL)
    missing.push('REACT_APP_SUBMIT_LEAD_URL');
  if (!process.env.REACT_APP_TRACK_EVENT_URL)
    missing.push('REACT_APP_TRACK_EVENT_URL');
  if (!process.env.REACT_APP_WEBSITE_LEAD_URL)
    missing.push('REACT_APP_WEBSITE_LEAD_URL');
  if (!process.env.REACT_APP_AI_CHAT_URL) missing.push('REACT_APP_AI_CHAT_URL');
  if (missing.length)
    console.warn('[CFG] Using FALLBACK URLs. Missing:', missing.join(', '));
  if (!CONFIG.TURNSTILE_SITE_KEY)
    console.warn('[CFG] Missing REACT_APP_TURNSTILE_SITE_KEY');
  if (!CONFIG.SUPABASE_ANON_KEY)
    console.warn('[CFG] Missing REACT_APP_SUPABASE_ANON_KEY');
}
