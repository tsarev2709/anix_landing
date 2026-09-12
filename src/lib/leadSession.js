import {
  ATTRIBUTION_WINDOW_MS,
  MARKETING_KEYS,
  isMeaningful,
  safePage,
  safeReferrer,
  sanitizeAttribution,
  sanitizeTouch,
  touchFromLocation,
  touchSignature,
} from './attribution';
const VISITOR_KEY = 'anix_visitor_v2';
const SESSION_KEY = 'anix_website_lead_session_v1';
const SESSION_TIMEOUT = 30 * 60 * 1000;
let visitor = null,
  session = null,
  ready = null;
let activeStartedAt = null,
  lastLocation = '',
  hooksInstalled = false;
let eventSink = () => {};
const nowIso = () => new Date().toISOString();
const quietly = (fn, fallback = null) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};
const read = (kind, key) =>
  quietly(() => JSON.parse(window[kind].getItem(key) || 'null'));
const write = (kind, key, value) =>
  quietly(() => window[kind].setItem(key, JSON.stringify(value)));
export function createLeadIdempotencyKey() {
  return (
    quietly(() => crypto.randomUUID()) ||
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`
  );
}
function withVisitorLock(fn) {
  // Serialize shared first touch and visit counts across same-origin tabs.
  try {
    if (navigator.locks?.request) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1500);
      return navigator.locks
        .request('anix-attribution-v2', { signal: controller.signal }, fn)
        .catch(() => quietly(fn))
        .finally(() => clearTimeout(timer));
    }
  } catch {
    /* Browser policy must not affect the product. */
  }
  return Promise.resolve(quietly(fn));
}
function updateVisitor(touch, newSession) {
  const stored = read('localStorage', VISITOR_KEY);
  if (
    /^[a-zA-Z0-9_-]{12,128}$/.test(stored?.id || '') &&
    Number.isFinite(stored.sessions_count)
  )
    visitor = stored;
  if (!visitor) visitor = { id: createLeadIdempotencyKey(), sessions_count: 0 };
  for (const key of ['first_touch', 'last_touch']) {
    if (
      !Number.isFinite(Date.parse(visitor[key]?.touch_at)) ||
      Date.now() - Date.parse(visitor[key].touch_at) >= ATTRIBUTION_WINDOW_MS
    )
      visitor[key] = null;
  }
  if (isMeaningful(touch)) {
    if (!visitor.first_touch) {
      visitor.first_touch = touch;
      visitor.window_started_at = touch.touch_at;
    }
    visitor.last_touch = touch;
  }
  if (newSession) {
    session.previous_visit_at = visitor.last_visit_at || '';
    visitor.sessions_count += 1;
    visitor.last_visit_at = session.started_at;
  }
  write('localStorage', VISITOR_KEY, visitor);
}
function persistSession() {
  if (!session) return;
  session.last_active_at = nowIso();
  write('sessionStorage', SESSION_KEY, session);
}
function pausePage() {
  if (!session || activeStartedAt === null) return;
  const page = session.pages[session.pages.length - 1];
  if (page)
    page.duration_seconds =
      Math.round(
        (page.duration_seconds +
          Math.max(0, (Date.now() - activeStartedAt) / 1000)) *
          10
      ) / 10;
  activeStartedAt = null;
  persistSession();
}
function startSession(touch) {
  session = {
    id: createLeadIdempotencyKey(),
    started_at: nowIso(),
    last_active_at: nowIso(),
    landing_page: touch.landing_page,
    initial_referrer: touch.referrer,
    first_touch: touch,
    current_attribution: touch,
    pages: [],
  };
  updateVisitor(touch, true);
  session.visitor_id = visitor.id;
}
function pageView() {
  if (!session) return;
  pausePage();
  const location = window.location.pathname + window.location.search;
  if (lastLocation === location && session.pages.length) return;
  lastLocation = location;
  session.pages.push({
    path: safePage(location),
    title: (document.title || 'Anix').slice(0, 500),
    entered_at: nowIso(),
    duration_seconds: 0,
  });
  session.pages = session.pages.slice(-80);
  activeStartedAt = document.visibilityState === 'hidden' ? null : Date.now();
  persistSession();
  quietly(() => eventSink('page_view', { path: safePage(location) }));
  if (/\/(price|stoimost)\/?$/.test(window.location.pathname))
    quietly(() => eventSink('pricing_view', {}));
}
async function routeChanged() {
  if (
    !session ||
    lastLocation === window.location.pathname + window.location.search
  )
    return;
  const touch = touchFromLocation(window.location.href, '', Date.now());
  // Document referrer is consumed only at entry, never on SPA pageviews.
  if (
    isMeaningful(touch) &&
    touchSignature(touch) !== touchSignature(session.current_attribution)
  ) {
    await withVisitorLock(() => {
      session.current_attribution = touch;
      updateVisitor(touch, false);
    });
  }
  pageView();
}
function installHooks() {
  if (hooksInstalled) return;
  hooksInstalled = true;
  for (const name of ['pushState', 'replaceState']) {
    const original = window.history[name].bind(window.history);
    window.history[name] = (...args) => {
      const result = original(...args);
      quietly(() => routeChanged().catch(() => {}));
      return result;
    };
  }
  window.addEventListener('popstate', () =>
    quietly(() => routeChanged().catch(() => {}))
  );
  window.addEventListener('pagehide', () => quietly(pausePage));
  window.addEventListener('storage', (event) => {
    if (event.key === VISITOR_KEY)
      quietly(() => {
        const v = read('localStorage', VISITOR_KEY);
        if (v?.id) visitor = v;
      });
  });
  document.addEventListener('visibilitychange', () =>
    quietly(() => {
      if (document.visibilityState === 'hidden') pausePage();
      else if (
        session &&
        Date.now() - Date.parse(session.last_active_at) >= SESSION_TIMEOUT
      ) {
        withVisitorLock(() =>
          startSession(touchFromLocation(window.location.href, '', Date.now()))
        )
          .then(() => {
            lastLocation = '';
            pageView();
          })
          .catch(() => {});
      } else activeStartedAt = Date.now();
    })
  );
}
export function setAttributionEventSink(sink) {
  eventSink = sink;
}
export function recordAttributionCta(ctaId) {
  quietly(() => { if (session) { session.last_cta_id = ctaId; persistSession(); } });
}
export function initLeadSessionTracking() {
  if (ready || typeof window === 'undefined') return ready || Promise.resolve();
  ready = withVisitorLock(() => {
    const previous = read('sessionStorage', SESSION_KEY);
    const touch = touchFromLocation(window.location.href, document.referrer, Date.now());
    if (
      previous?.id &&
      Array.isArray(previous.pages) &&
      Date.now() - Date.parse(previous.last_active_at || previous.started_at) <
        SESSION_TIMEOUT
    ) {
      session = previous;
      session.current_attribution =
        session.current_attribution ||
        sanitizeTouch({
          ...session.first_touch,
          source: session.first_touch?.utm_source || touch.source,
          landing_page: session.landing_page,
          referrer: session.initial_referrer,
          touch_at: session.started_at,
        });
      const campaignChanged =
        MARKETING_KEYS.some((key) => touch[key]) &&
        MARKETING_KEYS.some(
          (key) => touch[key] !== session.current_attribution[key]
        );
      const externalArrival =
        touch.referrer &&
        touch.referrer !== session.current_attribution.referrer;
      const changed = Boolean(campaignChanged || externalArrival);
      if (changed) session.current_attribution = touch;
      updateVisitor(
        changed
          ? touch
          : !session.visitor_id
            ? session.current_attribution
            : null,
        !session.visitor_id
      );
      session.visitor_id = visitor.id;
    } else startSession(touch);
    pageView();
    installHooks();
  });
  return ready;
}
export function getLeadSessionSnapshot(conversionType = '', ctaId = '') {
  return quietly(() => {
    if (!session || !visitor) return {};
    pausePage();
    if (document.visibilityState !== 'hidden') activeStartedAt = Date.now();
    const stored = read('localStorage', VISITOR_KEY);
    if (stored?.id === visitor.id) visitor = stored;
    if (
      ['first_touch', 'last_touch'].some(
        (key) =>
          visitor[key] &&
          Date.now() - Date.parse(visitor[key].touch_at) >=
            ATTRIBUTION_WINDOW_MS
      )
    )
      updateVisitor(null, false);
    const current = session.current_attribution;
    const snapshot = sanitizeAttribution({
      version: 2,
      visitor_id: visitor.id,
      session_id: session.id,
      captured_at: nowIso(),
      first_touch: visitor.first_touch,
      last_touch: visitor.last_touch,
      current_session: current,
      sessions_count: visitor.sessions_count,
      previous_visit_at: session.previous_visit_at,
      returning_visitor: visitor.sessions_count > 1,
      session_started_at: session.started_at,
      conversion_page: window.location.pathname,
      conversion_type: conversionType,
      cta_id: ctaId === 'form' ? session.last_cta_id || ctaId : ctaId,
      time_on_site_seconds: Math.max(
        0,
        Math.round((Date.now() - Date.parse(session.started_at)) / 1000)
      ),
      pages_viewed: session.pages,
    });
    return {
      ...snapshot,
      attribution_snapshot: snapshot,
      ...Object.fromEntries(
        MARKETING_KEYS.map((key) => [key, current?.[key] || ''])
      ),
      source: current?.source || 'direct',
      landing_page: session.landing_page,
      initial_referrer: session.initial_referrer,
      pages_viewed_count: session.pages.length,
      pages_viewed: JSON.parse(JSON.stringify(session.pages)),
      page_url: window.location.origin + safePage(window.location.pathname),
      page_path: safePage(window.location.pathname),
      page_title: (document.title || 'Anix').slice(0, 500),
      referrer: safeReferrer(document.referrer),
      user_agent: navigator.userAgent.slice(0, 1000),
      screen_width: window.screen?.width || null,
      screen_height: window.screen?.height || null,
      language: navigator.language || '',
      timezone: quietly(
        () => Intl.DateTimeFormat().resolvedOptions().timeZone,
        ''
      ),
    };
  }, {});
}
