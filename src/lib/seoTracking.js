import { track } from './analytics';

const METRIKA_COUNTER_ID = 103290769;
let initialized = false;

const sendGoal = (goal, meta = {}) => {
  track(goal, meta).catch(() => {});

  if (typeof window !== 'undefined' && typeof window.ym === 'function') {
    try {
      window.ym(METRIKA_COUNTER_ID, 'reachGoal', goal, meta);
    } catch {
      // Analytics must never break navigation or interaction.
    }
  }
};

const goalForLink = (anchor) => {
  const href = anchor.getAttribute('href') || '';

  if (href.startsWith('https://t.me/anix_helper')) return 'cta_telegram';
  if (href.startsWith('mailto:')) return 'cta_email';
  if (/^\/medicine\/?(?:[?#]|$)/.test(href)) return 'navigate_medicine';
  if (/^\/hse\/?(?:[?#]|$)/.test(href)) return 'navigate_hse';
  if (/^\/cases\//.test(href)) return 'open_case';
  if (href === '#cases' || href.endsWith('/#cases')) return 'view_cases';
  return null;
};

export function setupSeoTracking() {
  if (initialized || typeof document === 'undefined') return;
  initialized = true;

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const showreelButton = target.closest('.d1-showreel-poster');
    if (showreelButton) {
      sendGoal('showreel_open', { path: window.location.pathname });
      return;
    }

    const anchor = target.closest('a[href]');
    if (!anchor) return;

    const goal = goalForLink(anchor);
    if (!goal) return;

    sendGoal(goal, {
      path: window.location.pathname,
      href: anchor.getAttribute('href') || '',
      label: (anchor.textContent || '').trim().slice(0, 160),
    });
  });

  document.addEventListener(
    'submit',
    (event) => {
      const form = event.target instanceof HTMLFormElement ? event.target : null;
      if (!form) return;
      sendGoal('form_submit', {
        path: window.location.pathname,
        formId: form.id || '',
      });
    },
    true,
  );
}
