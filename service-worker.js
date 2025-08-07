self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.open('anix-cache').then(cache =>
      cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const contentType = networkResponse.headers.get('content-type') || '';
            if (/javascript|css|image/.test(contentType)) {
              cache.put(event.request, networkResponse.clone());
            }
          }
          return networkResponse;
        });
        return response || fetchPromise;
      })
    )
  );
});
