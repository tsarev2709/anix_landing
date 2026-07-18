const GEO_CACHE_KEY = 'anix-showreel-country-v1';
const GEO_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const GEO_TIMEOUT_MS = 1800;

export const SHOWREEL_URLS = {
  vk: 'https://vkvideo.ru/video_ext.php?oid=-174933827&id=456239051&hash=8a2d51037c33a713&hd=3&autoplay=1',
  youtube:
    'https://www.youtube.com/embed/fD-ELPdniGQ?autoplay=1&rel=0&playsinline=1&origin=https%3A%2F%2Fstudio.anix-ai.pro',
};

export const SHOWREEL_EXTERNAL_URLS = {
  vk: 'https://vkvideo.ru/video-174933827_456239051',
  youtube: 'https://youtu.be/fD-ELPdniGQ',
};

function browserFallbackProvider() {
  const languages = Array.isArray(navigator.languages)
    ? navigator.languages
    : [navigator.language || ''];
  return languages.some((language) => String(language).toLowerCase().startsWith('ru'))
    ? 'vk'
    : 'youtube';
}

function readCachedCountry() {
  try {
    const cached = JSON.parse(localStorage.getItem(GEO_CACHE_KEY) || 'null');
    if (
      cached &&
      typeof cached.country === 'string' &&
      Number(cached.expiresAt) > Date.now()
    ) {
      return cached.country.toUpperCase();
    }
  } catch {
    // Storage may be blocked in private mode. Detection still works without caching.
  }
  return null;
}

function cacheCountry(country) {
  try {
    localStorage.setItem(
      GEO_CACHE_KEY,
      JSON.stringify({
        country,
        expiresAt: Date.now() + GEO_CACHE_TTL_MS,
      }),
    );
  } catch {
    // Ignore unavailable storage.
  }
}

let providerPromise = null;

export function getFallbackShowreelProvider() {
  return browserFallbackProvider();
}

export function resolveShowreelProvider() {
  const cachedCountry = readCachedCountry();
  if (cachedCountry) return Promise.resolve(cachedCountry === 'RU' ? 'vk' : 'youtube');
  if (providerPromise) return providerPromise;

  providerPromise = (async () => {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timeout = setTimeout(() => controller?.abort(), GEO_TIMEOUT_MS);

    try {
      const response = await fetch('https://ipapi.co/country/', {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
        signal: controller?.signal,
        headers: { Accept: 'text/plain' },
      });
      if (!response.ok) throw new Error(`Country lookup failed: ${response.status}`);

      const country = (await response.text()).trim().toUpperCase();
      if (!/^[A-Z]{2}$/.test(country)) throw new Error('Invalid country response');

      cacheCountry(country);
      return country === 'RU' ? 'vk' : 'youtube';
    } catch {
      return browserFallbackProvider();
    } finally {
      clearTimeout(timeout);
    }
  })();

  return providerPromise;
}
