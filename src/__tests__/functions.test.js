/** @jest-environment node */

const { execSync } = require('child_process');
const fs = require('fs');

class Headers {
  constructor(init = {}) {
    this.map = {};
    for (const k in init) this.map[k.toLowerCase()] = init[k];
  }
  get(name) {
    return this.map[name.toLowerCase()] || null;
  }
  set(name, value) {
    this.map[name.toLowerCase()] = value;
  }
}
class Request {
  constructor(url, init = {}) {
    this.url = url;
    this.method = init.method || 'GET';
    this.headers = new Headers(init.headers || {});
    this.body = init.body;
  }
  async json() {
    return JSON.parse(this.body || '{}');
  }
  async text() {
    return this.body || '';
  }
}
class Response {
  constructor(body, init = {}) {
    this.status = init.status || 200;
    this.headers = new Headers(init.headers || {});
    this.body = body;
  }
  async json() {
    return JSON.parse(this.body);
  }
  async arrayBuffer() {
    return Buffer.from(this.body);
  }
}

global.Headers = Headers;
global.Request = Request;
global.Response = Response;
global.atob = (b) => Buffer.from(b, 'base64').toString('binary');
global.Deno = { env: { get: (k) => process.env[k] } };

function compile(file) {
  try {
    execSync(
      `node node_modules/typescript/bin/tsc ${file} --target ES2020 --module commonjs --esModuleInterop --skipLibCheck --noEmit false --noEmitOnError false`
    );
  } catch (e) {
    /* ignore */
  }
}

beforeAll(() => {
  compile('supabase/functions/submit-lead/index.ts');
  compile('supabase/functions/email-open/index.ts');
  compile('supabase/functions/track-event/index.ts');
  compile('supabase/functions/submit-website-lead/index.ts');
});

afterAll(() => {
  try {
    fs.unlinkSync('supabase/functions/submit-lead/index.js');
  } catch (e) {
    /* ignore */
  }
  try {
    fs.unlinkSync('supabase/functions/email-open/index.js');
  } catch (e) {
    /* ignore */
  }
  try {
    fs.unlinkSync('supabase/functions/track-event/index.js');
  } catch (e) {
    /* ignore */
  }
  try {
    fs.unlinkSync('supabase/functions/submit-website-lead/index.js');
  } catch (e) {
    /* ignore */
  }
  try {
    fs.unlinkSync('supabase/functions/_shared/cors.js');
  } catch (e) {
    /* ignore */
  }
  try {
    fs.unlinkSync('supabase/functions/_shared/amocrm.js');
  } catch (e) {
    /* ignore */
  }
});

// rest of tests remain same as earlier

describe('submit-lead', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete global.fetch;
  });

  test('success returns leadId', async () => {
    jest.doMock(
      'https://esm.sh/@supabase/supabase-js@2',
      () => ({
        createClient: () => ({
          from: () => ({
            insert: () => ({
              select: () => ({
                single: () =>
                  Promise.resolve({ data: { id: '123' }, error: null }),
              }),
            }),
          }),
        }),
      }),
      { virtual: true }
    );
    const submitLead =
      require('../../supabase/functions/submit-lead/index.js').default;
    process.env.SB_URL = 'https://example.supabase.co';
    process.env.SB_SERVICE_ROLE_KEY = 'role';
    process.env.RESEND_API_KEY = 'resend';
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );
    const req = new Request('https://example.com', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'a@b.com',
        position: 'CEO',
        telegram: '@user123',
        consent: true,
        utm: '',
        referrer: '',
        pathname: '/',
      }),
    });
    const res = await submitLead(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.leadId).toBe('123');
  });
});

describe('email-open', () => {
  test('returns png', async () => {
    jest.doMock(
      'https://esm.sh/@supabase/supabase-js@2',
      () => ({
        createClient: () => ({
          from: () => ({ insert: () => Promise.resolve({ error: null }) }),
        }),
      }),
      { virtual: true }
    );
    process.env.SB_URL = 'https://example.supabase.co';
    process.env.SB_SERVICE_ROLE_KEY = 'role';
    const emailOpen =
      require('../../supabase/functions/email-open/index.js').default;
    const req = new Request('https://example.com?lead_id=abc');
    const res = await emailOpen(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/png');
    const buf = Buffer.from(await res.arrayBuffer());
    expect(buf.length).toBeGreaterThan(0);
  });
});

describe('track-event', () => {
  test('rejects unknown events', async () => {
    jest.doMock('@supabase/supabase-js', () => ({
      createClient: () => ({
        from: () => ({ insert: () => Promise.resolve({ error: null }) }),
      }),
    }));
    process.env.ALLOWED_ORIGIN = 'https://example.com';
    const track =
      require('../../supabase/functions/track-event/index.js').default;
    const req = new Request('https://example.com', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
      },
      body: JSON.stringify({ event: 'unknown' }),
    });
    const res = await track(req);
    expect(res.status).toBe(400);
  });
});

describe('submit-website-lead', () => {
  beforeEach(() => jest.resetModules());
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete global.fetch;
    delete process.env.TURNSTILE_SECRET_KEY;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.WEBSITE_LEAD_ALLOWED_ORIGINS;
  });

  const validBody = {
    idempotency_key: '12345678-1234-4234-9234-123456789abc',
    turnstile_token: 'test-token',
    privacy_consent: true,
    privacy_consent_at: '2026-08-07T00:00:00.000Z',
    privacy_policy_version: '2026-08-07',
    name: 'Тестовый лид',
    email: 'test@example.com',
    contact_value: '',
    message: 'Тестовая заявка с сайта Anix',
    page_url: 'https://studio.anix-ai.pro/',
    page_path: '/',
    pages_viewed: [],
  };

  test.each([
    'maritime',
    'hospitality',
    'tourism',
    'education',
    'pharma',
    'hse',
  ])('stores and forwards the complete %s brief', async (variant) => {
    const config = require('../content/industryForms.json')[variant];
    const brief = {
      task_id: config.tasks[0][0],
      context_id: config.contexts[0][0],
      placement_id: '',
      deadline_id: '',
      scope_id: '',
      budget_id: '',
      budget_basis: 'project',
      detail: '',
      comment: '',
    };
    let saved;
    const chain = {
      select: () => chain,
      eq: () => chain,
      maybeSingle: async () => ({ data: null, error: null }),
      insert: (value) => {
        saved = { ...value, id: 'industry-test' };
        return chain;
      },
      update: (value) => {
        saved = { ...saved, ...value };
        return chain;
      },
      single: async () => ({ data: saved, error: null }),
    };
    jest.doMock(
      'https://esm.sh/@supabase/supabase-js@2',
      () => ({ createClient: () => ({ from: () => chain }) }),
      { virtual: true }
    );
    const sync = jest.fn(async () => ({
      leadId: 123,
      contactId: 456,
      briefSynced: true,
    }));
    jest.doMock('../../supabase/functions/_shared/amocrm.ts', () => ({
      syncAmoLead: sync,
      AmoIntegrationError: class extends Error {},
    }));
    process.env.TURNSTILE_SECRET_KEY = 'test';
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test';
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        success: true,
        action: 'website_lead',
        hostname: 'studio.anix-ai.pro',
      }),
    }));
    const handler =
      require('../../supabase/functions/submit-website-lead/index.js').default;
    const response = await handler(
      new Request('https://example.com', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          origin: 'https://studio.anix-ai.pro',
        },
        body: JSON.stringify({
          ...validBody,
          company: 'Test company',
          message: '',
          form_variant: variant,
          form_version: 'industry-v1',
          brief,
          metrika_client_id: '12345',
        }),
      })
    );
    expect(response.status).toBe(200);
    expect(saved.brief).toEqual(brief);
    expect(saved.metrika_client_id).toBe('12345');
    expect(saved.brief_crm_synced).toBe(true);
    expect(sync.mock.calls[0][0].industryFields['ANIX · Задача']).toBe(
      config.tasks[0][1]
    );
    expect(sync.mock.calls[0][0].note).toContain(config.contexts[0][1]);
  });

  test('rejects a forged industry variant before contacting external services', async () => {
    global.fetch = jest.fn();
    const handler =
      require('../../supabase/functions/submit-website-lead/index.js').default;
    const response = await handler(
      new Request('https://example.com', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          origin: 'https://studio.anix-ai.pro',
        },
        body: JSON.stringify({
          ...validBody,
          form_variant: '__proto__',
          form_version: 'industry-v1',
          brief: {},
        }),
      })
    );
    expect(response.status).toBe(400);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('rejects a lead without privacy consent', async () => {
    const submitWebsiteLead =
      require('../../supabase/functions/submit-website-lead/index.js').default;
    const req = new Request('https://example.com', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://studio.anix-ai.pro',
      },
      body: JSON.stringify({ ...validBody, privacy_consent: false }),
    });
    const res = await submitWebsiteLead(req);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('privacy_consent_required');
  });

  test('rejects an untrusted origin before processing the request', async () => {
    const submitWebsiteLead =
      require('../../supabase/functions/submit-website-lead/index.js').default;
    const req = new Request('https://example.com', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://attacker.example',
      },
      body: JSON.stringify(validBody),
    });
    const res = await submitWebsiteLead(req);
    expect(res.status).toBe(403);
    expect((await res.json()).error).toBe('origin_not_allowed');
  });

  test('does not store a lead when Turnstile validation fails', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'turnstile-secret';
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: false }),
      })
    );
    const submitWebsiteLead =
      require('../../supabase/functions/submit-website-lead/index.js').default;
    const req = new Request('https://example.com', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://studio.anix-ai.pro',
      },
      body: JSON.stringify(validBody),
    });
    const res = await submitWebsiteLead(req);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('turnstile_failed');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('keeps the production origin when custom origins are configured', async () => {
    process.env.WEBSITE_LEAD_ALLOWED_ORIGINS = 'https://preview.example';
    process.env.TURNSTILE_SECRET_KEY = 'turnstile-secret';
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: false }),
      })
    );
    const submitWebsiteLead =
      require('../../supabase/functions/submit-website-lead/index.js').default;
    const req = new Request('https://example.com', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://studio.anix-ai.pro',
      },
      body: JSON.stringify(validBody),
    });
    const res = await submitWebsiteLead(req);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('turnstile_failed');
  });
});
