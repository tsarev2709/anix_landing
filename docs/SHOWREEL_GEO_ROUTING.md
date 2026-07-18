# Geo-aware showreel routing

The home-page showreel selects its player from the visitor's public IP country:

- `RU` uses VK Video.
- All other countries use the privacy-enhanced YouTube embed for `fD-ELPdniGQ`.

The browser requests `https://ipapi.co/country/` with a short timeout and caches only the two-letter country code in local storage for 24 hours. If the lookup is unavailable, Russian browser languages fall back to VK and other languages fall back to YouTube.

The video iframe is still created only after the visitor presses the showreel poster, so geo lookup does not cause either video platform to load during the initial page render.
