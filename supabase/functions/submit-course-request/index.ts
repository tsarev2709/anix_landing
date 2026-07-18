// Self-contained on purpose (no shared imports) — same reasoning as
// delete-account/index.ts: deployable by pasting straight into the
// Supabase Dashboard's single-file function editor.
//
// Receives the "Заказать новый курс" form payload (see
// src/features/hseMvp/lib/crm.ts buildCourseRequestPayload) and:
//   1. finds/creates a Contact + Company in amoCRM,
//   2. creates a Lead in the configured pipeline/stage (resolved by name,
//      never a hardcoded account-specific ID),
//   3. attaches the free-text form fields as a note on the Lead rather than
//      mapping them to custom fields — this way the integration works on
//      any amoCRM account with zero pre-configuration (no custom fields to
//      create/match by name),
//   4. emails the team via Resend (same provider already used by
//      supabase/functions/submit-lead in this repo).
//
// File attachments: the frontend currently only sends file metadata
// (name/size/type), never the file bytes — see the Stage 0 audit. So this
// function lists that metadata in the note for now; real file upload to
// object storage is a separate, later increment.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, authorization, x-client-info, apikey',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

type CourseRequestPayload = {
  companyName?: string;
  industry?: string;
  employeesCount?: string | number;
  sites?: string;
  riskTypes?: string;
  courseGoal?: string;
  materialsDescription?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  comment?: string;
  files?: { name: string; size: number; type: string }[];
};

async function amoFetch(
  subdomain: string,
  token: string,
  path: string,
  init: RequestInit = {}
) {
  const res = await fetch(`https://${subdomain}.amocrm.ru${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });
  return res;
}

async function findOrCreateContact(
  subdomain: string,
  token: string,
  payload: CourseRequestPayload
): Promise<number | null> {
  const query = payload.email || payload.phone;
  if (query) {
    const searchRes = await amoFetch(
      subdomain,
      token,
      `/api/v4/contacts?query=${encodeURIComponent(query)}`
    );
    if (searchRes.ok) {
      const data = await searchRes.json().catch(() => null);
      const existing = data?._embedded?.contacts?.[0];
      if (existing?.id) return existing.id;
    }
  }

  const customFields = [];
  if (payload.phone) {
    customFields.push({ field_code: 'PHONE', values: [{ value: payload.phone }] });
  }
  if (payload.email) {
    customFields.push({ field_code: 'EMAIL', values: [{ value: payload.email }] });
  }

  const createRes = await amoFetch(subdomain, token, '/api/v4/contacts', {
    method: 'POST',
    body: JSON.stringify([
      {
        name: payload.contactName || payload.email || 'Заявка с сайта',
        custom_fields_values: customFields.length ? customFields : null,
      },
    ]),
  });
  if (!createRes.ok) return null;
  const created = await createRes.json().catch(() => null);
  return created?._embedded?.contacts?.[0]?.id || null;
}

async function findOrCreateCompany(
  subdomain: string,
  token: string,
  companyName: string
): Promise<number | null> {
  if (!companyName) return null;

  const searchRes = await amoFetch(
    subdomain,
    token,
    `/api/v4/companies?query=${encodeURIComponent(companyName)}`
  );
  if (searchRes.ok) {
    const data = await searchRes.json().catch(() => null);
    const existing = data?._embedded?.companies?.[0];
    if (existing?.id) return existing.id;
  }

  const createRes = await amoFetch(subdomain, token, '/api/v4/companies', {
    method: 'POST',
    body: JSON.stringify([{ name: companyName }]),
  });
  if (!createRes.ok) return null;
  const created = await createRes.json().catch(() => null);
  return created?._embedded?.companies?.[0]?.id || null;
}

async function resolvePipelineStage(
  subdomain: string,
  token: string,
  pipelineName: string,
  stageName: string
): Promise<{ pipelineId: number | null; statusId: number | null }> {
  if (!pipelineName) return { pipelineId: null, statusId: null };

  const res = await amoFetch(subdomain, token, '/api/v4/leads/pipelines');
  if (!res.ok) return { pipelineId: null, statusId: null };
  const data = await res.json().catch(() => null);
  const pipelines = data?._embedded?.pipelines || [];
  const pipeline = pipelines.find(
    (p: any) => p.name?.toLowerCase() === pipelineName.toLowerCase()
  );
  if (!pipeline) return { pipelineId: null, statusId: null };

  if (!stageName) return { pipelineId: pipeline.id, statusId: null };
  const statuses = pipeline._embedded?.statuses || [];
  const status = statuses.find(
    (s: any) => s.name?.toLowerCase() === stageName.toLowerCase()
  );
  return { pipelineId: pipeline.id, statusId: status?.id || null };
}

function buildNoteText(payload: CourseRequestPayload): string {
  const lines = [
    `Компания: ${payload.companyName || '—'}`,
    `Отрасль: ${payload.industry || '—'}`,
    `Кол-во сотрудников: ${payload.employeesCount || '—'}`,
    `Площадки: ${payload.sites || '—'}`,
    `Виды рисков: ${payload.riskTypes || '—'}`,
    `Задача курса: ${payload.courseGoal || '—'}`,
    `Уже есть материалы: ${payload.materialsDescription || '—'}`,
    `Контактное лицо: ${payload.contactName || '—'}`,
    `Телефон: ${payload.phone || '—'}`,
    `Email: ${payload.email || '—'}`,
    `Комментарий: ${payload.comment || '—'}`,
  ];
  if (payload.files?.length) {
    lines.push(
      'Прикреплённые файлы (только метаданные, сами файлы уточнить у клиента):',
      ...payload.files.map((f) => `  - ${f.name} (${f.type || 'unknown'}, ${f.size} bytes)`)
    );
  }
  return lines.join('\n');
}

async function addLeadNote(
  subdomain: string,
  token: string,
  leadId: number,
  text: string
) {
  await amoFetch(subdomain, token, `/api/v4/leads/${leadId}/notes`, {
    method: 'POST',
    body: JSON.stringify([{ note_type: 'common', params: { text } }]),
  });
}

async function notifyByEmail(payload: CourseRequestPayload) {
  const resendKey = Deno.env.get('RESEND_API_KEY');
  const fromEmail = Deno.env.get('NOTIFY_FROM_EMAIL');
  const notifyEmails = (Deno.env.get('NOTIFY_EMAILS') || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
  if (!resendKey || !fromEmail || !notifyEmails.length) return;

  const html = buildNoteText(payload)
    .split('\n')
    .map((line) => `<p>${line}</p>`)
    .join('');

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to: notifyEmails,
      subject: `Новая заявка на курс: ${payload.companyName || 'без названия компании'}`,
      html,
    }),
  }).catch(() => null);
}

async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  try {
    const payload: CourseRequestPayload = await req.json();
    if (!payload.contactName || !payload.email || !payload.phone) {
      return json({ error: 'missing_required_fields' }, 400);
    }

    const subdomain = Deno.env.get('AMOCRM_SUBDOMAIN');
    const token = Deno.env.get('AMOCRM_ACCESS_TOKEN');
    if (!subdomain || !token) return json({ error: 'misconfigured' }, 500);

    const contactId = await findOrCreateContact(subdomain, token, payload);
    const companyId = payload.companyName
      ? await findOrCreateCompany(subdomain, token, payload.companyName)
      : null;

    const { pipelineId, statusId } = await resolvePipelineStage(
      subdomain,
      token,
      Deno.env.get('AMOCRM_PIPELINE_NAME') || '',
      Deno.env.get('AMOCRM_STAGE_NAME') || ''
    );

    const embedded: Record<string, any[]> = {};
    if (contactId) embedded.contacts = [{ id: contactId }];
    if (companyId) embedded.companies = [{ id: companyId }];

    const leadRes = await amoFetch(subdomain, token, '/api/v4/leads', {
      method: 'POST',
      body: JSON.stringify([
        {
          name: `Заявка на курс: ${payload.companyName || payload.contactName}`,
          pipeline_id: pipelineId || undefined,
          status_id: statusId || undefined,
          _embedded: Object.keys(embedded).length ? embedded : undefined,
        },
      ]),
    });
    if (!leadRes.ok) {
      const detail = await leadRes.text().catch(() => '');
      return json({ error: 'amocrm_lead_failed', detail }, 502);
    }
    const leadData = await leadRes.json().catch(() => null);
    const leadId = leadData?._embedded?.leads?.[0]?.id;
    if (leadId) {
      await addLeadNote(subdomain, token, leadId, buildNoteText(payload));
    }

    await notifyByEmail(payload);

    return json({ ok: true, leadId });
  } catch (_err) {
    return json({ error: 'unexpected_error' }, 500);
  }
}

if (typeof Deno !== 'undefined' && typeof (Deno as any).serve === 'function') {
  (Deno as any).serve(handler);
}
export default handler;
