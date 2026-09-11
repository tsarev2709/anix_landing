# amoCRM stub widget (temporary, no secrets)

amoCRM's "Create integration" flow in amoMarket requires a widget archive
(manifest.json) even for a headless, API-only (OAuth) integration with no
visual UI. This is a placeholder package to get through that upload gate:

- `manifest.json` — `"locations": []`, so the widget renders nowhere in the
  amoCRM interface.
- `script.js` — no-op callbacks.
- `i18n/` — minimal ru/en labels.

Download `anix-hse-amocrm-stub-widget.zip` directly and upload it as-is in
amoCRM's integration creation form. Contains no credentials or account-specific
IDs. Safe to delete once the real integration (Client ID/Secret) exists.
