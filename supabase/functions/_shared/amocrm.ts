declare const Deno: any;
declare const process: any;

const DEFAULT_PIPELINE_NAME = 'Входящие заявки';

let contextCache: { expiresAt: number; value: AmoContext } | null = null;
let fieldsCache: { expiresAt: number; value: any[] } | null = null;

export type AmoLeadInput = {
  sourceId: string;
  markerLabel: string;
  leadName: string;
  contactName: string;
  company?: string;
  email?: string;
  phone?: string;
  telegram?: string;
  note: string;
  tags: string[];
  existingContactId?: number | null;
  existingLeadId?: number | null;
  retryAttempt?: number;
};

export type AmoSyncResult = {
  accountId: number;
  pipelineId: number;
  statusId: number;
  contactId: number;
  leadId: number;
};

type AmoContext = {
  accountId: number;
  pipelineId: number;
  statusId: number;
};

export class AmoIntegrationError extends Error {
  retryable: boolean;

  constructor(message: string, retryable = false) {
    super(message);
    this.retryable = retryable;
  }
}

function env(name: string): string {
  try {
    if (typeof Deno !== 'undefined') return Deno.env.get(name) || '';
  } catch {
    // Node tests use process.env.
  }
  try {
    return process?.env?.[name] || '';
  } catch {
    return '';
  }
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

function baseUrl(): string {
  return env('AMOCRM_BASE_URL').replace(/\/+$/, '');
}

async function request(path: string, init: RequestInit = {}): Promise<any> {
  const url = baseUrl();
  const token = env('AMOCRM_LONG_LIVED_TOKEN');
  if (!url || !/^https:\/\/[^/]+\.amocrm\.ru$/i.test(url) || !token) {
    throw new AmoIntegrationError('amocrm_not_configured');
  }

  let response: Response;
  try {
    response = await fetchWithTimeout(`${url}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    });
  } catch {
    throw new AmoIntegrationError('amocrm_network_error', true);
  }

  if (!response.ok) {
    const retryable = response.status === 429 || response.status >= 500;
    throw new AmoIntegrationError(`amocrm_http_${response.status}`, retryable);
  }
  if (response.status === 204) return null;
  return response.json().catch(() => null);
}

async function getContext(): Promise<AmoContext> {
  if (contextCache && contextCache.expiresAt > Date.now()) {
    return contextCache.value;
  }

  const [account, pipelinesResponse] = await Promise.all([
    request('/api/v4/account'),
    request('/api/v4/leads/pipelines'),
  ]);
  const pipelineName = env('AMOCRM_PIPELINE_NAME') || DEFAULT_PIPELINE_NAME;
  const pipelines = pipelinesResponse?._embedded?.pipelines || [];
  const pipeline = pipelines.find(
    (item: any) =>
      !item.is_archive &&
      String(item.name || '')
        .trim()
        .toLowerCase() === pipelineName.toLowerCase()
  );
  if (!pipeline) throw new AmoIntegrationError('amocrm_pipeline_not_found');

  const statuses = [...(pipeline?._embedded?.statuses || [])]
    .filter(
      (item: any) => item.type === 0 && item.id !== 142 && item.id !== 143
    )
    .sort((a: any, b: any) => Number(a.sort || 0) - Number(b.sort || 0));
  if (!statuses[0]) {
    throw new AmoIntegrationError('amocrm_working_status_not_found');
  }

  const value = {
    accountId: Number(account?.id),
    pipelineId: Number(pipeline.id),
    statusId: Number(statuses[0].id),
  };
  if (!value.accountId || !value.pipelineId || !value.statusId) {
    throw new AmoIntegrationError('amocrm_context_invalid');
  }
  contextCache = { value, expiresAt: Date.now() + 10 * 60 * 1000 };
  return value;
}

async function getContactFields(): Promise<any[]> {
  if (fieldsCache && fieldsCache.expiresAt > Date.now()) {
    return fieldsCache.value;
  }
  try {
    const response = await request('/api/v4/contacts/custom_fields?limit=250');
    const fields = response?._embedded?.custom_fields || [];
    fieldsCache = { value: fields, expiresAt: Date.now() + 30 * 60 * 1000 };
    return fields;
  } catch {
    return [];
  }
}

function normalizedPhone(value: string): string {
  return value.replace(/\D/g, '');
}

function normalizedTelegram(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/t\.me\//, '')
    .replace(/^tg:\/\/resolve\?domain=/, '')
    .replace(/^@/, '')
    .replace(/[/?#].*$/, '');
}

function fieldValues(contact: any, fieldCode: string): string[] {
  return (contact?.custom_fields_values || [])
    .filter(
      (field: any) => String(field.field_code || '').toUpperCase() === fieldCode
    )
    .flatMap((field: any) => field.values || [])
    .map((item: any) => String(item.value || ''));
}

function contactMatches(contact: any, input: AmoLeadInput): boolean {
  const email = String(input.email || '')
    .trim()
    .toLowerCase();
  const emailMatch =
    email &&
    fieldValues(contact, 'EMAIL').some(
      (value) => value.trim().toLowerCase() === email
    );
  const phone = normalizedPhone(input.phone || '');
  const phoneMatch =
    phone &&
    fieldValues(contact, 'PHONE').some(
      (value) => normalizedPhone(value) === phone
    );
  const telegram = normalizedTelegram(input.telegram || '');
  const telegramMatch =
    telegram &&
    (contact?.custom_fields_values || []).some((field: any) => {
      const name = String(field.field_name || '').toLowerCase();
      if (!name.includes('telegram') && !name.includes('телеграм'))
        return false;
      return (field.values || []).some(
        (item: any) => normalizedTelegram(String(item.value || '')) === telegram
      );
    });
  return Boolean(emailMatch || phoneMatch || telegramMatch);
}

async function findContact(input: AmoLeadInput): Promise<number | null> {
  const queries = [input.email, input.phone, input.telegram].filter(
    Boolean
  ) as string[];
  const matches = new Map<number, any>();
  for (const query of queries) {
    const response = await request(
      `/api/v4/contacts?query=${encodeURIComponent(query)}&limit=20`
    );
    for (const contact of response?._embedded?.contacts || []) {
      if (contactMatches(contact, input))
        matches.set(Number(contact.id), contact);
    }
  }
  return matches.size === 1 ? Number(matches.keys().next().value) : null;
}

function optionalContactFields(fields: any[], input: AmoLeadInput): any[] {
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

  if (input.telegram && telegramField) {
    values.push({
      field_id: Number(telegramField.id),
      values: [{ value: input.telegram }],
    });
  }
  if (input.company && companyField) {
    values.push({
      field_id: Number(companyField.id),
      values: [{ value: input.company }],
    });
  }
  return values;
}

async function createContact(input: AmoLeadInput): Promise<number> {
  const fields = await getContactFields();
  const customFields: any[] = [];
  if (input.email) {
    customFields.push({
      field_code: 'EMAIL',
      values: [{ value: input.email, enum_code: 'WORK' }],
    });
  }
  if (input.phone) {
    customFields.push({
      field_code: 'PHONE',
      values: [{ value: input.phone, enum_code: 'WORK' }],
    });
  }
  customFields.push(...optionalContactFields(fields, input));

  const response = await request('/api/v4/contacts', {
    method: 'POST',
    body: JSON.stringify([
      {
        name: input.contactName || input.company || 'Контакт с сайта Anix',
        custom_fields_values: customFields,
        _embedded: { tags: input.tags.map((name) => ({ name })) },
      },
    ]),
  });
  const contactId = Number(response?._embedded?.contacts?.[0]?.id);
  if (!contactId) throw new AmoIntegrationError('amocrm_contact_create_failed');
  return contactId;
}

async function findRecentLead(
  contactId: number,
  leadName: string
): Promise<number | null> {
  const contact = await request(`/api/v4/contacts/${contactId}?with=leads`);
  const candidates = (contact?._embedded?.leads || []).slice(-8).reverse();
  const cutoff = Math.floor(Date.now() / 1000) - 60 * 60;
  for (const item of candidates) {
    const lead = await request(`/api/v4/leads/${Number(item.id)}`);
    if (lead?.name === leadName && Number(lead?.created_at || 0) >= cutoff) {
      return Number(lead.id);
    }
  }
  return null;
}

async function createLead(
  input: AmoLeadInput,
  contactId: number,
  context: AmoContext
): Promise<number> {
  const response = await request('/api/v4/leads', {
    method: 'POST',
    body: JSON.stringify([
      {
        name: input.leadName.slice(0, 250),
        pipeline_id: context.pipelineId,
        status_id: context.statusId,
        _embedded: {
          contacts: [{ id: contactId, is_main: true }],
          tags: input.tags.map((name) => ({ name })),
        },
      },
    ]),
  });
  const leadId = Number(response?._embedded?.leads?.[0]?.id);
  if (!leadId) throw new AmoIntegrationError('amocrm_lead_create_failed');
  return leadId;
}

async function ensureNote(
  leadId: number,
  marker: string,
  noteText: string
): Promise<void> {
  const existing = await request(`/api/v4/leads/${leadId}/notes?limit=100`);
  const alreadyExists = (existing?._embedded?.notes || []).some(
    (note: any) =>
      note?.note_type === 'common' &&
      String(note?.params?.text || '').includes(marker)
  );
  if (alreadyExists) return;
  await request(`/api/v4/leads/${leadId}/notes`, {
    method: 'POST',
    body: JSON.stringify([
      {
        note_type: 'common',
        params: { text: noteText.slice(0, 20_000) },
      },
    ]),
  });
}

export async function syncAmoLead(input: AmoLeadInput): Promise<AmoSyncResult> {
  if (!input.email && !input.phone && !input.telegram) {
    throw new AmoIntegrationError('amocrm_identifiable_contact_required');
  }

  const context = await getContext();
  let contactId = Number(input.existingContactId || 0);
  if (!contactId) contactId = (await findContact(input)) || 0;
  if (!contactId) contactId = await createContact(input);

  let leadId = Number(input.existingLeadId || 0);
  if (!leadId && Number(input.retryAttempt || 0) > 1) {
    leadId = (await findRecentLead(contactId, input.leadName)) || 0;
  }
  if (!leadId) leadId = await createLead(input, contactId, context);

  const marker = `${input.markerLabel}:\n${input.sourceId}`;
  await ensureNote(leadId, marker, input.note);

  return {
    ...context,
    contactId,
    leadId,
  };
}
