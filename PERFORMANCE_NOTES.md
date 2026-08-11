# Performance safeguards

The production build generates responsive WebP variants for the homepage showreel poster before React compilation.

- `640w` target: <= 220 KiB
- `960w` target: <= 360 KiB
- `1344w` target: <= 560 KiB

The build fails if those budgets are exceeded. The homepage preloads the responsive poster and marks the rendered image as high priority. Non-home routes are lazy-loaded. Fingerprinted `/static/` assets and `/optimized/` assets use cache-first in the service worker; documents remain network-first.
