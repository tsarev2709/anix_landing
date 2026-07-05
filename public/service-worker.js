self.addEventListener('install', event => {
  self.skipWaiting();
});

const cacheName = 'anix-cache-v2';
const cacheableContent = /javascript|css|image/;

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const contentType = networkResponse.headers.get('content-type') || '';
          if (cacheableContent.test(contentType)) {
            const responseToCache = networkResponse.clone();
            caches.open(cacheName).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
        }
        return networkResponse;
      })
      .catch(() =>
        caches.open(cacheName).then(cache =>
          cache.match(event.request).then(response => {
            if (response) return response;
            return Response.error();
          })
        )
      )
  );
});
