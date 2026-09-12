/** @jest-environment node */
const contract = require('../lib/attribution');
describe('amoCRM structured attribution', () => {
  let fields, calls, amo;
  beforeEach(() => {
    jest.resetModules();
    fields = Object.entries(contract.AMO_ATTRIBUTION_FIELDS).map(
      ([key, name], i) => ({
        id: i + 100,
        name,
        code: 'ANIX_' + key.toUpperCase(),
        type: 'text',
      })
    );
    calls = [];
    process.env.AMOCRM_BASE_URL = 'https://test.amocrm.ru';
    process.env.AMOCRM_LONG_LIVED_TOKEN = 'test-secret';
    global.fetch = jest.fn(async (url, init = {}) => {
      calls.push({ url, ...init });
      if (url.includes('/custom_fields')) {
        if (init.method === 'POST')
          fields.push(
            ...JSON.parse(init.body).map((f, i) => ({ ...f, id: 900 + i }))
          );
        return {
          ok: true,
          status: 200,
          json: async () => ({ _embedded: { custom_fields: fields } }),
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          id: 123,
          custom_fields_values: [
            { field_id: 100, values: [{ value: 'original-visitor' }] },
          ],
        }),
      };
    });
    amo = require('../../supabase/functions/_shared/amocrm.ts');
  });
  afterEach(() => {
    delete global.fetch;
    delete process.env.AMOCRM_BASE_URL;
    delete process.env.AMOCRM_LONG_LIVED_TOKEN;
  });
  test('case 6: fills source/campaign/offer but preserves populated deal fields', async () => {
    const touch = {
      source: 'telegram',
      utm_source: 'telegram',
      utm_campaign: 'hse_test',
      anix_offer: 'hse_onboarding',
      landing_page: '/hse/',
      touch_at: new Date().toISOString(),
    };
    const result = await amo.enrichAttributionLead(123, {
      visitor_id: 'visitor-test-123',
      session_id: 'session-test-123',
      first_touch: touch,
      last_touch: touch,
      current_session: touch,
      conversion_type: 'form',
      conversion_page: '/cases/',
    });
    expect(result).toBe(true);
    const patch = JSON.parse(
      calls.find((c) => c.method === 'PATCH').body
    ).custom_fields_values;
    expect(patch.some((f) => f.field_id === 100)).toBe(false);
    expect(patch.some((f) => f.values[0].value === 'telegram')).toBe(true);
    expect(patch.some((f) => f.values[0].value === 'hse_onboarding')).toBe(
      true
    );
  });
  test('provision is idempotent and reads before creating', async () => {
    fields = [];
    await amo.provisionAttributionFields();
    await amo.provisionAttributionFields();
    expect(calls[0].method).not.toBe('POST');
    expect(calls.filter((c) => c.method === 'POST')).toHaveLength(1);
    expect(fields).toHaveLength(
      Object.keys(contract.AMO_ATTRIBUTION_FIELDS).length
    );
  });
  test('ambiguous or incompatible existing fields abort provisioning without writes', async () => {
    fields.push({ ...fields[0], id: 999 });
    await expect(amo.provisionAttributionFields()).rejects.toThrow('ambiguous');
    expect(calls.filter((c) => c.method === 'POST')).toHaveLength(0);
  });
  test('CRM field failure is reported separately and never throws into form delivery', async () => {
    global.fetch.mockRejectedValue(new Error('offline'));
    await expect(
      amo.enrichAttributionLead(123, {
        visitor_id: 'visitor-test-123',
        session_id: 'session-test-123',
        conversion_type: 'form',
      })
    ).resolves.toBe(false);
  });
});
