const STORAGE_KEY = 'anix_website_lead_session_v1';
const MAX_PAGE_VIEWS = 80;

let initialized = false;
let activeStartedAt = null;
let activePageIndex = -1;
let lastKnownLocation = '';

const nowIso = () => new Date().toISOString();

function makeId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  const random = Math.random().toString(36).slice(2);
  return `${Date.now().toString(36)}-${random}`;
}

function readSession() {
  if (typeof window === 'undefined') return null;
  try {
    const parsed = JSON.parse(
      window.sessionStorage.getItem(STORAGE_KEY) || 'null'
    );
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.pages)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(session) {
  if (typeof window === 'undefined' || !session) return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Tracking must never interfere with the site or the form.
  }
}

function firstTouchParams() {
  const params = new URLSearchParams(window.location.search);
  const value = (name) => (params.get(name) || '').slice(0, 500);
  return {
    utm_source: value('utm_source'),
    utm_medium: value('utm_medium'),
    utm_campaign: value('utm_campaign'),
    utm_content: value('utm_content'),
    utm_term: value('utm_term'),
    yclid: value('yclid'),
    gclid: value('gclid'),
  };
}

function createSession() {
  return {
    id: makeId(),
    started_at: nowIso(),
    landing_page: `${window.location.pathname}${window.location.search}`.slice(
      0,
      2000
    ),
    initial_referrer: (document.referrer || '').slice(0, 2000),
    first_touch: firstTouchParams(),
    pages: [],
  };
}

function currentLocationKey() {
  return `${window.location.pathname}${window.location.search}`;
}

function pauseActivePage() {
  if (activeStartedAt === null || activePageIndex < 0) return;
  const session = readSession();
  const page = session?.pages?.[activePageIndex];
  if (!page) return;

  const elapsed = Math.max(0, (Date.now() - activeStartedAt) / 1000);
  page.duration_seconds =
    Math.round((Number(page.duration_seconds) + elapsed) * 10) / 10;
  writeSession(session);
  activeStartedAt = null;
}

function resumeActivePage() {
  if (activePageIndex >= 0 && activeStartedAt === null) {
    activeStartedAt = Date.now();
  }
}

function beginPageView() {
  if (typeof window === 'undefined') return;
  pauseActivePage();

  const locationKey = currentLocationKey();
  let session = readSession();
  if (!session) session = createSession();

  session.pages.push({
    path: window.location.pathname.slice(0, 1000),
    title: (document.title || 'Anix').slice(0, 500),
    entered_at: nowIso(),
    duration_seconds: 0,
  });
  if (session.pages.length > MAX_PAGE_VIEWS) {
    session.pages = session.pages.slice(-MAX_PAGE_VIEWS);
  }

  activePageIndex = session.pages.length - 1;
  activeStartedAt = document.visibilityState === 'hidden' ? null : Date.now();
  lastKnownLocation = locationKey;
  writeSession(session);
}

function checkForRouteChange() {
  if (currentLocationKey() !== lastKnownLocation) beginPageView();
}

export function initLeadSessionTracking() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  beginPageView();

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = (...args) => {
    originalPushState(...args);
    checkForRouteChange();
  };
  window.history.replaceState = (...args) => {
    originalReplaceState(...args);
    checkForRouteChange();
  };

  window.addEventListener('popstate', checkForRouteChange);
  window.addEventListener('hashchange', checkForRouteChange);
  window.addEventListener('pagehide', pauseActivePage);
  window.addEventListener('beforeunload', pauseActivePage);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') pauseActivePage();
    else resumeActivePage();
  });
}

function deriveSource(session) {
  if (session.first_touch?.utm_source) return session.first_touch.utm_source;
  if (!session.initial_referrer) return 'direct';
  try {
    const referrerHost = new URL(session.initial_referrer).hostname;
    if (referrerHost && referrerHost !== window.location.hostname)
      return referrerHost;
  } catch {
    return 'referral';
  }
  return 'internal';
}

export function getLeadSessionSnapshot() {
  if (typeof window === 'undefined') return {};
  pauseActivePage();
  const session = readSession() || createSession();
  resumeActivePage();

  const startedAt = Date.parse(session.started_at);
  const timeOnSite = Number.isFinite(startedAt)
    ? Math.max(0, Math.round((Date.now() - startedAt) / 1000))
    : 0;

  return {
    session_id: session.id,
    session_started_at: session.started_at,
    landing_page: session.landing_page,
    initial_referrer: session.initial_referrer,
    source: deriveSource(session),
    ...session.first_touch,
    time_on_site_seconds: timeOnSite,
    pages_viewed_count: session.pages.length,
    pages_viewed: session.pages,
    page_url: window.location.href.slice(0, 2000),
    page_path: window.location.pathname.slice(0, 1000),
    page_title: (document.title || 'Anix').slice(0, 500),
    referrer: (document.referrer || '').slice(0, 2000),
    user_agent: (navigator.userAgent || '').slice(0, 1000),
    screen_width: window.screen?.width || null,
    screen_height: window.screen?.height || null,
    language: (navigator.language || '').slice(0, 32),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
  };
}

export function createLeadIdempotencyKey() {
  return makeId();
}
