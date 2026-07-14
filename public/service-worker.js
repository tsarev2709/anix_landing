self.addEventListener('install', () => {
  self.skipWaiting();
});

const cacheName = 'anix-cache-v4';
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

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Never let the service worker serve page navigations or HTML documents.
  // GitHub Pages must always provide the latest route HTML so a stale build
  // cannot keep referencing an obsolete JavaScript bundle.
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    return;
  }

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isStaticAsset =
    isSameOrigin && (staticPath.test(url.pathname) || optimizedPath.test(url.pathname));

  if (isStaticAsset) {
    event.respondWith(cacheFirst(event.request));
  }
});
