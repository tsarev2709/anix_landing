import { createClient } from '@supabase/supabase-js';

const readEnv = (viteKey: string, reactKey: string) =>
  process.env[viteKey] || process.env[reactKey] || '';

export const getHseSupabaseConfig = () => {
  const url = readEnv('VITE_SUPABASE_URL', 'REACT_APP_SUPABASE_URL');
  const anonKey = readEnv(
    'VITE_SUPABASE_ANON_KEY',
    'REACT_APP_SUPABASE_ANON_KEY'
  );
  const allowedDomains = readEnv(
    'VITE_ALLOWED_EMAIL_DOMAINS',
    'REACT_APP_ALLOWED_EMAIL_DOMAINS'
  )
    .split(',')
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);
  const adminEmail = readEnv(
    'VITE_TEST_ADMIN_EMAIL',
    'REACT_APP_TEST_ADMIN_EMAIL'
  );

  return {
    url,
    anonKey,
    allowedDomains,
    adminEmail,
    isConfigured: Boolean(url && anonKey),
  };
};

let hseSupabaseClient: ReturnType<typeof createClient> | null = null;

export const getHseSupabaseClient = () => {
  const config = getHseSupabaseConfig();
  if (!config.isConfigured) return null;
  if (!hseSupabaseClient) {
    hseSupabaseClient = createClient(config.url, config.anonKey);
  }
  return hseSupabaseClient;
};

export const isAllowedWorkEmail = (email: string) => {
  const { allowedDomains } = getHseSupabaseConfig();
  if (!allowedDomains.length) return true;
  const domain = email.split('@')[1]?.toLowerCase();
  return Boolean(domain && allowedDomains.includes(domain));
};
