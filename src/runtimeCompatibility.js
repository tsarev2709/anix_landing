const RECOVERY_KEY = 'anix-runtime-recovery-v1';

function isChunkLoadFailure(reason) {
  const message = String((reason && reason.message) || reason || '');
  return /ChunkLoadError|Loading chunk|dynamically imported module|Failed to fetch/i.test(message);
}

function buildFreshUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set('__anix_recovery', Date.now().toString());
  return url.toString();
}

export async function clearLegacyRuntimeCaches() {
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }

    if ('caches' in window) {
      const keys = await window.caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.indexOf('anix-cache-') === 0)
          .map((key) => window.caches.delete(key)),
      );
    }
  } catch (error) {
    console.warn('[runtime] cache cleanup was not completed', error);
  }
}

export async function recoverFromRuntimeFailure(reason) {
  if (!isChunkLoadFailure(reason)) return false;
  if (window.sessionStorage.getItem(RECOVERY_KEY) === '1') return false;

  window.sessionStorage.setItem(RECOVERY_KEY, '1');
  await clearLegacyRuntimeCaches();
  window.location.replace(buildFreshUrl());
  return true;
}

export function installRuntimeRecovery() {
  const url = new URL(window.location.href);
  if (url.searchParams.has('__anix_recovery')) {
    url.searchParams.delete('__anix_recovery');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  } else {
    window.sessionStorage.removeItem(RECOVERY_KEY);
  }

  window.addEventListener('unhandledrejection', (event) => {
    recoverFromRuntimeFailure(event.reason);
  });

  window.addEventListener('error', (event) => {
    recoverFromRuntimeFailure(event.error || event.message);
  });

  clearLegacyRuntimeCaches();
}
