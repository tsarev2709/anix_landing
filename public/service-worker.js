self.addEventListener('install', (event) => {
  self.skipWaiting();
});

const cacheName = 'anix-cache-v3';
const staticPath = /\/static\//;
const optimizedPath = /\/optimized\//;

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== cacheName).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

async function cacheFirst(request) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.status === 200) {
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const contentType = response.headers.get('content-type') || '';
      if (/javascript|css|image/.test(contentType)) {
        cache.put(request, response.clone());
      }
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached || Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isStaticAsset = isSameOrigin && (staticPath.test(url.pathname) || optimizedPath.test(url.pathname));

  event.respondWith(isStaticAsset ? cacheFirst(event.request) : networkFirst(event.request));
});
