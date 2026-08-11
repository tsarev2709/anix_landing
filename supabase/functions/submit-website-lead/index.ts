declare const Deno: any;
declare const process: any;

// This public function is deployed by the Supabase Actions workflow.

const DEFAULT_ORIGINS = [
  'https://studio.anix-ai.pro',
  'https://dev.studio.anix-ai.pro',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];
const MAX_BODY_BYTES = 80_000;
const MAX_PAGES = 80;
const AMO_PIPELINE_NAME = 'Входящие заявки';

let amoContextCache: { expiresAt: number; value: any } | null = null;
let amoFieldsCache: { expiresAt: number; value: any[] } | null = null;

function env(name: string): string {
  try {
    if (typeof Deno !== 'undefined') return Deno.env.get(name) || '';
  } catch {
    // Node tests use process.env below.
  }
  try {
    return process?.env?.[name] || '';
  } catch {
    return '';
  }
}

function allowedOrigins(): string[] {
  const configured = env('WEBSITE_LEAD_ALLOWED_ORIGINS');
  const extraOrigins = configured
    ? configured
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
    : [];
  return [...new Set([...DEFAULT_ORIGINS, ...extraOrigins])];
}

function isAllowedOrigin(origin: string): boolean {
  return Boolean(origin && allowedOrigins().includes(origin));
}

function cors(origin: string): Record<string, string> {
  return {
    ...(isAllowedOrigin(origin)
      ? { 'Access-Control-Allow-Origin': origin }
      : {}),
    'Access-Control-Allow-Headers':
      'content-type, x-client-info, apikey, authorization',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(body: any, status: number, origin: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...cors(origin),
    },
  });
}

function text(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/\u0000/g, '')
    .trim()
    .slice(0, maxLength);
}

function integer(value: unknown, min = 0, max = 2_000_000_000): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function normalizedPhone(value: string): string {
  return value.replace(/\D/g, '');
}

function normalizedTelegram(value: string): string {
  return value
    .toLowerCase()
    .replace(/^https?:\/\/t\.me\//, '')
    .replace(/^tg:\/\/resolve\?domain=/, '')
    .replace(/^@/, '')
    .replace(/[/?#].*$/, '');
}

function inferContact(value: string): {
  contact_type: string;
  phone: string;
  telegram: string;
} {
  if (!value) return { contact_type: '', phone: '', telegram: '' };
  const telegram =
    value.startsWith('@') ||
    /(?:^|\/)t\.me\//i.test(value) ||
    /^tg:\/\//i.test(value) ||
    /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(value);
  return telegram
    ? { contact_type: 'telegram', phone: '', telegram: value }
    : { contact_type: 'phone', phone: value, telegram: '' };
}

function sanitizePages(value: unknown): any[] {
  if (!Array.isArray(value)) return [];
  return value.slice(-MAX_PAGES).map((page) => ({
    path: text(page?.path, 1000),
    title: text(page?.title, 500),
    entered_at: text(page?.entered_at, 64),
    duration_seconds: integer(page?.duration_seconds, 0, 86_400) || 0,
  }));
}

function sanitizePayload(input: any): any {
  const email = text(input?.email, 254).toLowerCase();
  const contactValue = text(input?.contact_value, 120);
  const inferred = inferContact(contactValue);
  const suppliedPhone = text(input?.phone, 120);
  const suppliedTelegram = text(input?.telegram, 120);
  const phone = suppliedPhone || inferred.phone;
  const telegram = suppliedTelegram || inferred.telegram;
  const contactType =
    email && (phone || telegram)
      ? 'multiple'
      : inferred.contact_type || (email ? 'email' : '');
  const pages = sanitizePages(input?.pages_viewed);

  return {
    idempotency_key: text(input?.idempotency_key, 128),
    name: text(input?.name, 120),
    company: text(input?.company, 180),
    email,
    phone,
    telegram,
    contact_value: contactValue,
    contact_type: contactType,
    message: text(input?.message, 4000),
    source: text(input?.source, 500) || 'website',
    page_url: text(input?.page_url, 2000),
    page_path: text(input?.page_path, 1000),
    page_title: text(input?.page_title, 500),
    referrer: text(input?.referrer, 2000),
    initial_referrer: text(input?.initial_referrer, 2000),
    landing_page: text(input?.landing_page, 2000),
    utm_source: text(input?.utm_source, 500),
    utm_medium: text(input?.utm_medium, 500),
    utm_campaign: text(input?.utm_campaign, 500),
    utm_content: text(input?.utm_content, 500),
    utm_term: text(input?.utm_term, 500),
    yclid: text(input?.yclid, 500),
    gclid: text(input?.gclid, 500),
    session_id: text(input?.session_id, 128),
    session_started_at: text(input?.session_started_at, 64) || null,
    time_on_site_seconds:
      integer(input?.time_on_site_seconds, 0, 31_536_000) || 0,
    pages_viewed_count: pages.length,
    pages_viewed: pages,
    user_agent: text(input?.user_agent, 1000),
    screen_width: integer(input?.screen_width, 0, 100_000),
    screen_height: integer(input?.screen_height, 0, 100_000),
    language: text(input?.language, 32),
    timezone: text(input?.timezone, 100),
  };
}

function validatePayload(payload: any): boolean {
  const validKey = /^[a-zA-Z0-9_-]{12,128}$/.test(payload.idempotency_key);
  const validEmail =
    !payload.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
  const hasContact = Boolean(payload.email || payload.contact_value);
  return Boolean(
    validKey &&
    payload.name.length >= 2 &&
    payload.message.length >= 10 &&
    validEmail &&
    hasContact
  );
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = 9000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function verifyTurnstile(
  token: string,
  origin: string
): Promise<boolean> {
  const secret = env('TURNSTILE_SECRET_KEY');
  if (!secret || !token) return false;

  const body = new URLSearchParams({ secret, response: token });
  const response = await fetchWithTimeout(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    },
    8000
  );
  if (!response.ok) return false;
  const result = await response.json().catch(() => null);
  if (!result?.success || result.action !== 'website_lead') return false;

  const expectedHostname = (() => {
    try {
      return new URL(origin).hostname;
    } catch {
      return '';
    }
  })();
  return !result.hostname || result.hostname === expectedHostname;
}

class IntegrationError extends Error {
  retryable: boolean;
  constructor(message: string, retryable = false) {
    super(message);
    this.retryable = retryable;
  }
}

function amoBaseUrl(): string {
  return env('AMOCRM_BASE_URL').replace(/\/+$/, '');
}

async function amoRequest(path: string, init: RequestInit = {}): Promise<any> {
  const baseUrl = amoBaseUrl();
  const token = env('AMOCRM_LONG_LIVED_TOKEN');
  if (!baseUrl || !/^https:\/\/[^/]+\.amocrm\.ru$/i.test(baseUrl) || !token) {
    throw new IntegrationError('amocrm_not_configured');
  }

  let response: Response;
  try {
    response = await fetchWithTimeout(`${baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    });
  } catch {
    throw new IntegrationError('amocrm_network_error', true);
  }

  if (!response.ok) {
    const retryable = response.status === 429 || response.status >= 500;
    throw new IntegrationError(`amocrm_http_${response.status}`, retryable);
  }
  if (response.status === 204) return null;
  return response.json().catch(() => null);
}

async function getAmoContext(): Promise<any> {
  if (amoContextCache && amoContextCache.expiresAt > Date.now()) {
    return amoContextCache.value;
  }

  const [account, pipelinesResponse] = await Promise.all([
    amoRequest('/api/v4/account'),
    amoRequest('/api/v4/leads/pipelines'),
  ]);
  const pipelineName = env('AMOCRM_PIPELINE_NAME') || AMO_PIPELINE_NAME;
  const pipelines = pipelinesResponse?._embedded?.pipelines || [];
  const pipeline = pipelines.find(
    (item: any) =>
      !item.is_archive &&
      String(item.name || '')
        .trim()
        .toLowerCase() === pipelineName.toLowerCase()
  );
  if (!pipeline) throw new IntegrationError('amocrm_pipeline_not_found');

  const statuses = [...(pipeline?._embedded?.statuses || [])]
    .filter(
      (item: any) => item.type === 0 && item.id !== 142 && item.id !== 143
    )
    .sort((a: any, b: any) => Number(a.sort || 0) - Number(b.sort || 0));
  if (!statuses[0])
    throw new IntegrationError('amocrm_working_status_not_found');

  const value = {
    accountId: Number(account?.id),
    pipelineId: Number(pipeline.id),
    statusId: Number(statuses[0].id),
  };
  if (!value.accountId || !value.pipelineId || !value.statusId) {
    throw new IntegrationError('amocrm_context_invalid');
  }
  amoContextCache = { value, expiresAt: Date.now() + 10 * 60 * 1000 };
  return value;
}

async function getAmoContactFields(): Promise<any[]> {
  if (amoFieldsCache && amoFieldsCache.expiresAt > Date.now()) {
    return amoFieldsCache.value;
  }
  try {
    const response = await amoRequest(
      '/api/v4/contacts/custom_fields?limit=250'
    );
    const fields = response?._embedded?.custom_fields || [];
    amoFieldsCache = { value: fields, expiresAt: Date.now() + 30 * 60 * 1000 };
    return fields;
  } catch {
    return [];
  }
}

function contactFieldValues(contact: any, fieldCode: string): string[] {
  const fields = contact?.custom_fields_values || [];
  return fields
    .filter(
      (field: any) => String(field.field_code || '').toUpperCase() === fieldCode
    )
    .flatMap((field: any) => field.values || [])
    .map((item: any) => String(item.value || ''));
}

function contactMatches(contact: any, payload: any): boolean {
  const emailMatch =
    payload.email &&
    contactFieldValues(contact, 'EMAIL').some(
      (value) => value.trim().toLowerCase() === payload.email
    );
  const phoneDigits = normalizedPhone(payload.phone || '');
  const phoneMatch =
    phoneDigits &&
    contactFieldValues(contact, 'PHONE').some(
      (value) => normalizedPhone(value) === phoneDigits
    );
  return Boolean(emailMatch || phoneMatch);
}

async function findExistingContact(payload: any): Promise<number | null> {
  const queries = [payload.email, payload.phone].filter(Boolean);
  const matches = new Map<number, any>();

  for (const query of queries) {
    const response = await amoRequest(
      `/api/v4/contacts?query=${encodeURIComponent(query)}&limit=20`
    );
    for (const contact of response?._embedded?.contacts || []) {
      if (contactMatches(contact, payload))
        matches.set(Number(contact.id), contact);
    }
  }
  return matches.size === 1 ? Number(matches.keys().next().value) : null;
}

function optionalContactCustomFields(fields: any[], payload: any): any[] {
  const values: any[] = [];
  const normalizedName = (value: string) => value.trim().toLowerCase();
  const telegramField = fields.find((field: any) =>
    ['telegram', 'телеграм'].some((needle) =>
      normalizedName(String(field.name || '')).includes(needle)
    )
  );
  const companyField = fields.find((field: any) =>
    ['компания', 'company'].includes(normalizedName(String(field.name || '')))
  );

  if (payload.telegram && telegramField) {
    values.push({
      field_id: Number(telegramField.id),
      values: [{ value: payload.telegram }],
    });
  }
  if (payload.company && companyField) {
    values.push({
      field_id: Number(companyField.id),
      values: [{ value: payload.company }],
    });
  }
  return values;
}

async function createContact(payload: any): Promise<number> {
  const fields = await getAmoContactFields();
  const customFields: any[] = [];
  if (payload.email) {
    customFields.push({
      field_code: 'EMAIL',
      values: [{ value: payload.email, enum_code: 'WORK' }],
    });
  }
  if (payload.phone) {
    customFields.push({
      field_code: 'PHONE',
      values: [{ value: payload.phone, enum_code: 'WORK' }],
    });
  }
  customFields.push(...optionalContactCustomFields(fields, payload));

  const response = await amoRequest('/api/v4/contacts', {
    method: 'POST',
    body: JSON.stringify([
      {
        name: payload.name,
        custom_fields_values: customFields,
        _embedded: { tags: [{ name: 'website' }] },
      },
    ]),
  });
  const contactId = Number(response?._embedded?.contacts?.[0]?.id);
  if (!contactId) throw new IntegrationError('amocrm_contact_create_failed');
  return contactId;
}

async function findRecentLead(
  contactId: number,
  leadName: string
): Promise<number | null> {
  const contact = await amoRequest(`/api/v4/contacts/${contactId}?with=leads`);
  const candidates = (contact?._embedded?.leads || []).slice(-5).reverse();
  const cutoff = Math.floor(Date.now() / 1000) - 30 * 60;
  for (const item of candidates) {
    const lead = await amoRequest(`/api/v4/leads/${Number(item.id)}`);
    if (lead?.name === leadName && Number(lead?.created_at || 0) >= cutoff) {
      return Number(lead.id);
    }
  }
  return null;
}

async function createLead(
  payload: any,
  contactId: number,
  context: any
): Promise<number> {
  const leadName = `Заявка с сайта — ${payload.company || payload.name}`.slice(
    0,
    250
  );
  const response = await amoRequest('/api/v4/leads', {
    method: 'POST',
    body: JSON.stringify([
      {
        name: leadName,
        pipeline_id: context.pipelineId,
        status_id: context.statusId,
        _embedded: {
          contacts: [{ id: contactId, is_main: true }],
          tags: [{ name: 'website' }],
        },
      },
    ]),
  });
  const leadId = Number(response?._embedded?.leads?.[0]?.id);
  if (!leadId) throw new IntegrationError('amocrm_lead_create_failed');
  return leadId;
}

function routeSummary(pages: any[]): string {
  return pages
    .slice(0, 40)
    .map(
      (page, index) =>
        `${index + 1}. ${page.path || '/'} — ${Math.round(Number(page.duration_seconds || 0))} сек.`
    )
    .join('\n');
}

function buildLeadNote(row: any): string {
  const utm =
    [
      row.utm_source && `source=${row.utm_source}`,
      row.utm_medium && `medium=${row.utm_medium}`,
      row.utm_campaign && `campaign=${row.utm_campaign}`,
      row.utm_content && `content=${row.utm_content}`,
      row.utm_term && `term=${row.utm_term}`,
    ]
      .filter(Boolean)
      .join(', ') || '—';
  const note = [
    'Новая заявка с сайта Anix',
    '',
    `Имя: ${row.name}`,
    `Компания: ${row.company || '—'}`,
    `Email: ${row.email || '—'}`,
    `Телефон: ${row.phone || '—'}`,
    `Telegram: ${row.telegram || '—'}`,
    '',
    'Сообщение:',
    row.message,
    '',
    `Страница отправки: ${row.page_url || row.page_path || '—'}`,
    `Первая страница: ${row.landing_page || '—'}`,
    `Referrer: ${row.initial_referrer || row.referrer || '—'}`,
    `Источник: ${row.source || 'website'}`,
    `UTM: ${utm}`,
    `Время на сайте: ${row.time_on_site_seconds || 0} сек.`,
    `Просмотрено страниц: ${row.pages_viewed_count || 0}`,
    '',
    'Маршрут:',
    routeSummary(row.pages_viewed || []) || '—',
    '',
    `Session ID: ${row.session_id || '—'}`,
    'Supabase Lead ID:',
    row.id,
  ].join('\n');
  return note.slice(0, 20_000);
}

async function ensureLeadNote(leadId: number, row: any): Promise<void> {
  const marker = `Supabase Lead ID:\n${row.id}`;
  const existing = await amoRequest(`/api/v4/leads/${leadId}/notes?limit=100`);
  const alreadyExists = (existing?._embedded?.notes || []).some(
    (note: any) =>
      note?.note_type === 'common' &&
      String(note?.params?.text || '').includes(marker)
  );
  if (alreadyExists) return;
  await amoRequest(`/api/v4/leads/${leadId}/notes`, {
    method: 'POST',
    body: JSON.stringify([
      { note_type: 'common', params: { text: buildLeadNote(row) } },
    ]),
  });
}

async function updateLead(sb: any, id: string, patch: any): Promise<any> {
  const { data, error } = await sb
    .from('website_leads')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error || !data) throw new Error('database_update_failed');
  return data;
}

async function syncToAmo(sb: any, row: any): Promise<any> {
  const attempt = Number(row.sync_attempts || 0) + 1;
  row = await updateLead(sb, row.id, {
    sync_attempts: attempt,
    last_sync_at: new Date().toISOString(),
    integration_error: null,
  });

  const context = await getAmoContext();
  let contactId = Number(row.amocrm_contact_id || 0);
  if (!contactId) {
    contactId = (await findExistingContact(row)) || (await createContact(row));
    row = await updateLead(sb, row.id, {
      amocrm_account_id: context.accountId,
      amocrm_contact_id: contactId,
      amocrm_pipeline_id: context.pipelineId,
      amocrm_status_id: context.statusId,
    });
  }

  let leadId = Number(row.amocrm_lead_id || 0);
  if (!leadId) {
    const leadName = `Заявка с сайта — ${row.company || row.name}`.slice(
      0,
      250
    );
    if (attempt > 1) leadId = (await findRecentLead(contactId, leadName)) || 0;
    if (!leadId) leadId = await createLead(row, contactId, context);
    row = await updateLead(sb, row.id, {
      status: 'sent_to_amocrm',
      amocrm_account_id: context.accountId,
      amocrm_lead_id: leadId,
      amocrm_contact_id: contactId,
      amocrm_pipeline_id: context.pipelineId,
      amocrm_status_id: context.statusId,
    });
  }

  await ensureLeadNote(leadId, row);
  return updateLead(sb, row.id, {
    status: 'completed',
    integration_error: null,
    amocrm_account_id: context.accountId,
    amocrm_lead_id: leadId,
    amocrm_contact_id: contactId,
    amocrm_pipeline_id: context.pipelineId,
    amocrm_status_id: context.statusId,
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function syncWithRetries(sb: any, row: any): Promise<any> {
  let lastError: any;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await syncToAmo(sb, row);
    } catch (error) {
      lastError = error;
      if (
        !(error instanceof IntegrationError) ||
        !error.retryable ||
        attempt === 2
      )
        break;
      await sleep(300 * 2 ** attempt);
      const { data } = await sb
        .from('website_leads')
        .select('*')
        .eq('id', row.id)
        .single();
      if (data) row = data;
    }
  }
  throw lastError;
}

async function findOrInsertLead(sb: any, payload: any): Promise<any> {
  const existing = await sb
    .from('website_leads')
    .select('*')
    .eq('idempotency_key', payload.idempotency_key)
    .maybeSingle();
  if (existing.data) return existing.data;
  if (existing.error) throw new Error('database_read_failed');

  const { data, error } = await sb
    .from('website_leads')
    .insert({
      ...payload,
      status: 'saved',
      payload,
    })
    .select()
    .single();
  if (!error && data) return data;
  if (error?.code === '23505') {
    const duplicate = await sb
      .from('website_leads')
      .select('*')
      .eq('idempotency_key', payload.idempotency_key)
      .single();
    if (duplicate.data) return duplicate.data;
  }
  throw new Error('database_insert_failed');
}

async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin') || '';
  if (req.method === 'OPTIONS') {
    return isAllowedOrigin(origin)
      ? new Response(null, { status: 204, headers: cors(origin) })
      : json({ error: 'origin_not_allowed' }, 403, origin);
  }
  if (req.method !== 'POST')
    return json({ error: 'method_not_allowed' }, 405, origin);
  if (!isAllowedOrigin(origin))
    return json({ error: 'origin_not_allowed' }, 403, origin);

  const contentLength = Number(req.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES)
    return json({ error: 'payload_too_large' }, 413, origin);

  let raw = '';
  let input: any;
  try {
    raw = await req.text();
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
      return json({ error: 'payload_too_large' }, 413, origin);
    }
    input = JSON.parse(raw || '{}');
  } catch {
    return json({ error: 'invalid_json' }, 400, origin);
  }

  const payload = sanitizePayload(input);
  if (!validatePayload(payload))
    return json({ error: 'invalid_payload' }, 400, origin);

  let turnstileOk = false;
  try {
    turnstileOk = await verifyTurnstile(
      text(input?.turnstile_token, 3000),
      origin
    );
  } catch {
    turnstileOk = false;
  }
  if (!turnstileOk) return json({ error: 'turnstile_failed' }, 400, origin);

  const sbUrl = env('SUPABASE_URL') || env('SB_URL');
  const serviceRoleKey =
    env('SUPABASE_SERVICE_ROLE_KEY') || env('SB_SERVICE_ROLE_KEY');
  if (!sbUrl || !serviceRoleKey)
    return json({ error: 'service_unavailable' }, 503, origin);

  try {
    // @ts-ignore Deno resolves this remote ESM dependency at deploy time.
    const supabaseModule = await import('https://esm.sh/@supabase/supabase-js@2');
    const { createClient } = supabaseModule;
    const sb = createClient(sbUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    let row = await findOrInsertLead(sb, payload);

    if (row.status === 'completed' && row.amocrm_lead_id) {
      return json(
        { ok: true, lead_id: row.id, synced: true, duplicate: true },
        200,
        origin
      );
    }

    try {
      row = await syncWithRetries(sb, row);
      console.info(`[website-lead] completed ${row.id}`);
      return json({ ok: true, lead_id: row.id, synced: true }, 200, origin);
    } catch (error) {
      const safeError =
        error instanceof Error ? text(error.message, 500) : 'amocrm_error';
      await updateLead(sb, row.id, {
        status: 'amocrm_error',
        integration_error: safeError,
        last_sync_at: new Date().toISOString(),
      }).catch(() => null);
      console.error(`[website-lead] amoCRM pending ${row.id}: ${safeError}`);
      return json(
        { error: 'delivery_pending', lead_id: row.id, saved: true },
        503,
        origin
      );
    }
  } catch (error) {
    console.error(
      `[website-lead] database failure: ${error instanceof Error ? error.message : 'unknown'}`
    );
    return json({ error: 'submission_failed' }, 500, origin);
  }
}

if (typeof Deno !== 'undefined' && typeof Deno.serve === 'function') {
  Deno.serve(handler);
}

export default handler;
