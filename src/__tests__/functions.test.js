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
      `npx tsc ${file} --target ES2020 --module commonjs --esModuleInterop --skipLibCheck --noEmitOnError false`
    );
  } catch (e) {
    /* ignore */
  }
}

beforeAll(() => {
  compile('supabase/functions/submit-lead/index.ts');
  compile('supabase/functions/email-open/index.ts');
  compile('supabase/functions/track-event/index.ts');
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
});

// rest of tests remain same as earlier

describe('submit-lead', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete global.fetch;
  });

  test('success returns leadId', async () => {
    jest.doMock('@supabase/supabase-js', () => ({
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
    }));
    const submitLead =
      require('../../supabase/functions/submit-lead/index.js').default;
    process.env.TURNSTILE_SECRET_KEY = 'secret';
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'role';
    process.env.RESEND_API_KEY = 'resend';
    global.fetch = jest.fn((url) => {
      if (url.includes('turnstile')) {
        return Promise.resolve({
          json: () => Promise.resolve({ success: true }),
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    });
    const req = new Request('https://example.com', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'a@b.com',
        position: 'CEO',
        telegram: '@user123',
        consent: true,
        captchaToken: 'token',
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

  test('captcha fail returns 400', async () => {
    jest.doMock('@supabase/supabase-js', () => ({
      createClient: () => ({
        from: () => ({
          insert: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: { id: '1' }, error: null }),
            }),
          }),
        }),
      }),
    }));
    const submitLead =
      require('../../supabase/functions/submit-lead/index.js').default;
    process.env.TURNSTILE_SECRET_KEY = 'secret';
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ success: false }) })
    );
    const req = new Request('https://example.com', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'a@b.com',
        position: 'CEO',
        telegram: '@user123',
        consent: true,
        captchaToken: 'bad',
        utm: '',
        referrer: '',
        pathname: '/',
      }),
    });
    const res = await submitLead(req);
    expect(res.status).toBe(400);
  });
});

describe('email-open', () => {
  test('returns png', async () => {
    jest.doMock('@supabase/supabase-js', () => ({
      createClient: () => ({
        from: () => ({ insert: () => Promise.resolve({ error: null }) }),
      }),
    }));
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
