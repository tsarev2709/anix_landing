import { CONFIG } from '../config';
import { getLeadSessionSnapshot } from './leadSession';
const BASE = 'https://t.me/anix_helper';
let prepared = null,
  pending = null;
export async function prepareTelegramAttribution() {
  if (prepared && prepared.expires > Date.now()) return prepared;
  if (pending) return pending;
  pending = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    try {
      const response = await fetch(CONFIG.ATTRIBUTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reserve' }),
        signal: controller.signal,
      });
      const result = await response.json();
      if (
        !response.ok ||
        !/^[a-f0-9]{32}$/.test(result.token) ||
        !/^[a-f0-9]{64}$/.test(result.capture_key)
      )
        return null;
      prepared = {
        token: result.token,
        capture_key: result.capture_key,
        expires: Date.now() + 240000,
      };
      return prepared;
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
      pending = null;
    }
  })();
  return pending;
}
export function telegramClick(anchor) {
  // Native navigation is never prevented or delayed by a network request.
  try {
    const token = prepared;
    prepared = null;
    if (!token || token.expires <= Date.now()) {
      anchor.href = BASE;
      return;
    }
    const snapshot = getLeadSessionSnapshot(
      'telegram',
      anchor.dataset.cta || 'telegram_link'
    ).attribution_snapshot;
    if (!snapshot) {
      anchor.href = BASE;
      return;
    }
    anchor.href = `${BASE}?start=${token.token}`;
    fetch(CONFIG.ATTRIBUTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        action: 'capture',
        token: token.token,
        capture_key: token.capture_key,
        snapshot,
      }),
    }).catch(() => {});
  } catch {
    anchor.href = BASE;
  }
}
export function setupTelegramAttribution() {
  const anchorFrom = (event) => {
    const anchor =
      event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!anchor) return null;
    try {
      const url = new URL(anchor.href);
      return url.hostname === 't.me' && url.pathname === '/anix_helper'
        ? anchor
        : null;
    } catch {
      return null;
    }
  };
  for (const name of ['pointerover', 'focusin', 'touchstart'])
    document.addEventListener(
      name,
      (event) => {
        if (anchorFrom(event)) prepareTelegramAttribution().catch(() => {});
      },
      { passive: true }
    );
  document.addEventListener(
    'click',
    (event) => {
      const anchor = anchorFrom(event);
      if (anchor) telegramClick(anchor);
    },
    true
  );
}
