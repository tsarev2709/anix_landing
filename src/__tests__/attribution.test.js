/** @jest-environment node */
const fs = require('fs');
const vm = require('vm');
const babel = require('@babel/core');
const contract = require('../lib/attribution');
const { buildMarketingUrl, UTM_PRESETS } = require('../lib/utmBuilder');
const compiled = babel.transformSync(
  fs.readFileSync('src/lib/leadSession.js', 'utf8'),
  {
    babelrc: false,
    configFile: false,
    plugins: ['@babel/plugin-transform-modules-commonjs'],
  }
).code;
function storage(map = new Map(), blocked = false) {
  return {
    getItem: (k) => {
      if (blocked) throw Error('denied');
      return map.get(k) || null;
    },
    setItem: (k, v) => {
      if (blocked) throw Error('quota');
      map.set(k, v);
    },
    removeItem: (k) => map.delete(k),
  };
}
function tab(shared, href, options = {}) {
  let time = options.time || Date.parse('2026-09-11T04:00:00Z');
  class Clock extends Date {
    constructor(...args) {
      super(...(args.length ? args : [time]));
    }
    static now() {
      return time;
    }
  }
  const events = {},
    docEvents = {};
  const window = {
    localStorage: storage(shared, options.blocked),
    sessionStorage: storage(options.sessionMap, options.blocked),
    location: new URL(href),
    screen: { width: 1280, height: 800 },
    addEventListener: (n, f) => {
      events[n] = f;
    },
    history: {
      pushState: (_a, _b, url) => {
        window.location = new URL(url, window.location);
      },
      replaceState: (_a, _b, url) => {
        window.location = new URL(url, window.location);
      },
    },
  };
  const document = {
    title: 'Anix',
    referrer: options.referrer || '',
    visibilityState: 'visible',
    addEventListener: (n, f) => {
      docEvents[n] = f;
    },
  };
  const context = {
    module: { exports: {} },
    exports: {},
    require: () => contract,
    window,
    document,
    Date: Clock,
    URL,
    Intl,
    Promise,
    AbortController,
    setTimeout,
    clearTimeout,
    crypto: require('crypto').webcrypto,
    navigator: { userAgent: 'test', language: 'ru', locks: options.locks },
  };
  context.exports = context.module.exports;
  vm.runInNewContext(compiled, context);
  return {
    api: context.module.exports,
    window,
    document,
    advance: (ms) => {
      time += ms;
    },
    docEvents,
    snapshot: () =>
      JSON.parse(
        JSON.stringify(
          context.module.exports.getLeadSessionSnapshot('form', 'hero')
        )
      ),
  };
}
const origin = 'https://studio.anix-ai.pro';
describe('visitor attribution contract', () => {
  test('cases 1–5: first, internal route, return direct, new campaign and immutable conversion', async () => {
    const shared = new Map();
    const a = tab(
      shared,
      origin +
        '/hse/?utm_source=TG&utm_medium=organic&utm_campaign=hse_test&anix_offer=hse_onboarding'
    );
    await a.api.initLeadSessionTracking();
    const first = a.snapshot();
    expect(first.first_touch.source).toBe('telegram');
    expect(first.first_touch.utm_source_raw).toBe('TG');
    expect(first.last_touch.anix_offer).toBe('hse_onboarding');
    a.advance(10000);
    a.window.history.pushState({}, '', '/cases/multon-partners/');
    await Promise.resolve();
    expect(a.snapshot().last_touch).toEqual(first.last_touch);
    const b = tab(shared, origin, { time: Date.parse('2026-09-14T04:00:00Z') });
    await b.api.initLeadSessionTracking();
    expect(b.snapshot()).toMatchObject({
      visitor_id: first.visitor_id,
      sessions_count: 2,
      returning_visitor: true,
      current_session: { source: 'direct' },
      last_touch: { source: 'telegram' },
    });
    const c = tab(
      shared,
      origin + '/?utm_source=tenchat&utm_campaign=pharma_test',
      { time: Date.parse('2026-09-15T04:00:00Z') }
    );
    await c.api.initLeadSessionTracking();
    const snapshot = c.snapshot().attribution_snapshot;
    expect(snapshot.first_touch.source).toBe('telegram');
    expect(snapshot.last_touch.source).toBe('tenchat');
    expect(
      contract.attributionFieldValues(snapshot).anix_offer
    ).toBeUndefined();
    c.window.history.pushState({}, '', '/?utm_source=vk&utm_campaign=another');
    await new Promise((r) => setImmediate(r));
    expect(snapshot.last_touch.source).toBe('tenchat');
    expect(c.snapshot().last_touch.source).toBe('vk');
    expect(snapshot.conversion_type).toBe('form');
  });
  test('case 7: storage reads and writes fail without losing in-memory IDs', async () => {
    const a = tab(new Map(), origin + '/?utm_source=telegram', {
      blocked: true,
    });
    await expect(a.api.initLeadSessionTracking()).resolves.toBeUndefined();
    const s = a.snapshot();
    a.window.history.pushState({}, '', '/medicine/');
    expect(a.snapshot().visitor_id).toBe(s.visitor_id);
    expect(a.snapshot().session_id).toBe(s.session_id);
  });
  test('case 9: custom sources are preserved', () => {
    const touch = contract.touchFromLocation(
      origin + '/?utm_source=weird_custom_partner',
      ''
    );
    expect(touch.utm_source).toBe('weird_custom_partner');
    expect(touch.utm_source_raw).toBe('weird_custom_partner');
  });
  test('case 10: contact fields and arbitrary URL parameters never enter the snapshot', async () => {
    const a = tab(
      new Map(),
      origin +
        '/?utm_source=telegram&email=person@example.com&phone=79990001122&anix_owner=%40private'
    );
    await a.api.initLeadSessionTracking();
    const safe = contract.sanitizeAttribution({
      ...a.snapshot().attribution_snapshot,
      email: 'private@example.com',
      name: 'Secret Name',
    });
    expect(JSON.stringify(safe)).not.toMatch(
      /example.com|79990001122|private|Secret Name/
    );
    expect(a.snapshot().page_url).toBe(origin + '/');
  });
  test('90-day expiration preserves a more recent last touch', async () => {
    const shared = new Map(),
      a = tab(shared, origin + '/?utm_source=telegram');
    await a.api.initLeadSessionTracking();
    const b = tab(shared, origin + '/?utm_source=tenchat', {
      time: Date.parse('2026-11-01T04:00:00Z'),
    });
    await b.api.initLeadSessionTracking();
    const c = tab(shared, origin, { time: Date.parse('2026-12-12T04:00:00Z') });
    await c.api.initLeadSessionTracking();
    expect(c.snapshot().first_touch).toBeNull();
    expect(c.snapshot().last_touch.source).toBe('tenchat');
    const d = tab(shared, origin + '/?utm_source=vk', {
      time: Date.parse('2026-12-13T04:00:00Z'),
    });
    await d.api.initLeadSessionTracking();
    expect(d.snapshot().first_touch.source).toBe('vk');
  });
  test('case 12: simultaneous tabs serialize visitor creation and first touch', async () => {
    let tail = Promise.resolve();
    const locks = {
      request: (_name, _options, fn) => {
        const result = tail.then(fn);
        tail = result.catch(() => {});
        return result;
      },
    };
    const shared = new Map(),
      a = tab(shared, origin + '/?utm_source=telegram', { locks }),
      b = tab(shared, origin + '/?utm_source=tenchat', { locks });
    await Promise.all([
      a.api.initLeadSessionTracking(),
      b.api.initLeadSessionTracking(),
    ]);
    expect(a.snapshot().visitor_id).toBe(b.snapshot().visitor_id);
    expect(b.snapshot().first_touch.source).toBe('telegram');
    expect(b.snapshot().last_touch.source).toBe('tenchat');
    expect(b.snapshot().sessions_count).toBe(2);
  });
  test('external search and click IDs are recognized without treating internal referrers as touches', () => {
    expect(
      contract.touchFromLocation(origin + '/hse/', origin + '/').source
    ).toBe('direct');
    expect(
      contract.touchFromLocation(
        origin + '/',
        'https://www.google.com/search?q=private'
      ).source
    ).toBe('google');
    expect(contract.touchFromLocation(origin + '/?yclid=abc', '').source).toBe(
      'yandex'
    );
    expect(contract.safeReferrer('https://example.com/?email=secret')).toBe(
      'https://example.com'
    );
  });
  test('old session is upgraded while retaining route history', async () => {
    const sessionMap = new Map([
      [
        'anix_website_lead_session_v1',
        JSON.stringify({
          id: 'legacy-session-123',
          started_at: '2026-09-11T04:00:00Z',
          pages: [{ path: '/medicine/', duration_seconds: 10 }],
          first_touch: { utm_source: 'telegram' },
          landing_page: '/medicine/',
        }),
      ],
    ]);
    const a = tab(new Map(), origin + '/cases/', { sessionMap });
    await a.api.initLeadSessionTracking();
    expect(a.snapshot().session_id).toBe('legacy-session-123');
    expect(a.snapshot().pages_viewed).toHaveLength(2);
  });
});
describe('UTM builder', () => {
  test.each(Object.entries(UTM_PRESETS))(
    '%s preset produces a usable link',
    (_name, [source, medium]) => {
      const url = new URL(
        buildMarketingUrl(origin + '/hse/', {
          utm_source: source,
          utm_medium: medium,
          utm_campaign: 'hse_onboarding_2026q3',
        })
      );
      expect(url.searchParams.get('utm_source')).toBe(source);
    }
  );
  test('rejects contacts, unexpected hosts and arbitrary query parameters', () => {
    const fields = {
      utm_source: 'telegram',
      utm_medium: 'organic',
      utm_campaign: 'good_campaign',
    };
    expect(() =>
      buildMarketingUrl(origin + '/?email=private', fields)
    ).toThrow();
    expect(() => buildMarketingUrl('https://evil.example/', fields)).toThrow();
    expect(() =>
      buildMarketingUrl(origin, { ...fields, anix_owner: 'person@example.com' })
    ).toThrow();
    expect(() =>
      buildMarketingUrl(origin, { ...fields, utm_campaign: 'HSE 2026' })
    ).toThrow();
  });
});
