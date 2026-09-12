import { MARKETING_KEYS, normalizeSource } from './attribution';
export const UTM_PRESETS = {
  Telegram: ['telegram', 'organic'],
  TenChat: ['tenchat', 'organic'],
  VK: ['vk', 'social'],
  Яндекс: ['yandex', 'cpc'],
  Email: ['email', 'email'],
  Conference: ['conference', 'offline'],
  Partner: ['partner', 'referral'],
  QR: ['qr', 'offline'],
};
export function buildMarketingUrl(base, fields) {
  const url = new URL(base);
  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'studio.anix-ai.pro' ||
    url.port ||
    url.username ||
    url.password
  )
    throw new Error('Используйте адрес https://studio.anix-ai.pro/');
  if (url.search || url.hash)
    throw new Error(
      'Укажите страницу без параметров и якоря. Метки задаются ниже.'
    );
  for (const key of MARKETING_KEYS.filter(
    (k) => !['gclid', 'yclid'].includes(k)
  )) {
    const raw = String(fields[key] || '').trim(),
      value = key === 'utm_source' ? normalizeSource(raw) : raw;
    if (['utm_source', 'utm_medium', 'utm_campaign'].includes(key) && !value)
      throw new Error('Заполните Source, Medium и Campaign.');
    if (!value) continue;
    if (!/^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/.test(value) || value.length > 120)
      throw new Error(
        key +
          ': только lowercase ASCII и snake_case, например hse_onboarding_2026q3.'
      );
    url.searchParams.set(key, value);
  }
  return url.toString();
}
