const legacyCachePrefix = 'anix-cache-';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.indexOf(legacyCachePrefix) === 0).map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim()),
  );
});

// This worker intentionally does not intercept requests. It exists only so
// devices controlled by an older ANIX worker receive an update, clear the
// obsolete cache and return to normal browser networking.
