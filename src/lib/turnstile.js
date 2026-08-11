const SCRIPT_ID = 'anix-turnstile-api';
const SCRIPT_URL =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let scriptPromise = null;

export function loadTurnstile() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('browser_required'));
  }
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    const script = existing || document.createElement('script');
    let timeoutId;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
    };
    const onLoad = () => {
      cleanup();
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error('turnstile_unavailable'));
    };
    const onError = () => {
      cleanup();
      scriptPromise = null;
      reject(new Error('turnstile_load_failed'));
    };

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);
    timeoutId = window.setTimeout(onError, 12000);

    if (!existing) {
      script.id = SCRIPT_ID;
      script.src = SCRIPT_URL;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  return scriptPromise;
}
