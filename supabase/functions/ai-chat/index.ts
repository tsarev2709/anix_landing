declare const Deno: any;
declare const process: any;

// @ts-ignore Deno requires the explicit TypeScript extension.
import { AmoIntegrationError, syncAmoLead } from '../_shared/amocrm.ts';

const DEFAULT_ORIGINS = [
  'https://studio.anix-ai.pro',
  'https://dev.studio.anix-ai.pro',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];
const MAX_BODY_BYTES = 48_000;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_MESSAGES = 16;
const FALLBACK_REPLY =
  'Сейчас AI-консультант временно недоступен. Опишите задачу и оставьте удобный контакт — команда Anix продолжит разговор.';

type GatewayFailure = Error & { errorClass?: string; status?: number };

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

function allowedOrigins(): string[] {
  const configured = env('AI_CHAT_ALLOWED_ORIGINS');
  const extra = configured
    ? configured
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
    : [];
  return [...new Set([...DEFAULT_ORIGINS, ...extra])];
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
      'Cache-Control': 'no-store',
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

function safeObject(value: unknown): Record<string, any> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, any>)
    : {};
}

function safePages(value: unknown): any[] {
  if (!Array.isArray(value)) return [];
  return value.slice(-80).map((page) => ({
    path: text(page?.path, 1000),
    title: text(page?.title, 500),
    entered_at: text(page?.entered_at, 64),
    duration_seconds: Math.max(
      0,
      Math.min(86_400, Math.round(Number(page?.duration_seconds || 0)))
    ),
  }));
}

function requestId(value: unknown): string {
  const candidate = text(value, 64);
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    candidate
  )
    ? candidate
    : crypto.randomUUID();
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function verifyTurnstile(
  token: string,
  origin: string
): Promise<boolean> {
  const secret = env('TURNSTILE_SECRET_KEY');
  if (!secret || !token) return false;
  const response = await fetchWithTimeout(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    },
    8000
  );
  if (!response.ok) return false;
  const result = await response.json().catch(() => null);
  if (!result?.success || result.action !== 'ai_chat') return false;
  const hostname = (() => {
    try {
      return new URL(origin).hostname;
    } catch {
      return '';
    }
  })();
  return !result.hostname || result.hostname === hostname;
}

async function createSupabaseClient(): Promise<any> {
  const url = env('SUPABASE_URL') || env('SB_URL');
  const key = env('SUPABASE_SERVICE_ROLE_KEY') || env('SB_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('supabase_not_configured');
  // @ts-ignore Deno resolves this remote ESM dependency at deploy time.
  const module = await import('https://esm.sh/@supabase/supabase-js@2');
  return module.createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function enforceRateLimit(sb: any, req: Request): Promise<any> {
  const ip =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';
  const userAgent = req.headers.get('user-agent') || '';
  const key = await sha256(`${ip}|${userAgent.slice(0, 300)}`);
  const limit = Math.max(5, Number(env('AI_CHAT_RATE_LIMIT') || 24));
  const windowSeconds = Math.max(
    60,
    Number(env('AI_CHAT_RATE_WINDOW_SECONDS') || 600)
  );
  const result = await sb.rpc('check_ai_chat_rate_limit', {
    p_key_hash: key,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (result.error) throw new Error('rate_limit_unavailable');
  return (
    result.data?.[0] || {
      allowed: false,
      remaining: 0,
      retry_after_seconds: 60,
    }
  );
}

function gatewayHeaders(): Record<string, string> {
  const sharedSecret = env('LOCAL_AI_GATEWAY_SECRET');
  const clientId = env('CF_ACCESS_CLIENT_ID');
  const clientSecret = env('CF_ACCESS_CLIENT_SECRET');
  if (!sharedSecret) throw new Error('gateway_secret_missing');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sharedSecret}`,
    ...(clientId ? { 'CF-Access-Client-Id': clientId } : {}),
    ...(clientSecret ? { 'CF-Access-Client-Secret': clientSecret } : {}),
  };
}

async function gatewayRequest(
  path: string,
  body: any,
  timeoutMs: number
): Promise<any> {
  const base = env('LOCAL_AI_GATEWAY_URL').replace(/\/+$/, '');
  if (!base || !/^https:\/\//i.test(base)) {
    const error = new Error('gateway_url_missing') as GatewayFailure;
    error.errorClass = 'offline';
    throw error;
  }

  let response: Response;
  try {
    response = await fetchWithTimeout(
      `${base}${path}`,
      { method: 'POST', headers: gatewayHeaders(), body: JSON.stringify(body) },
      timeoutMs
    );
  } catch (cause) {
    const error = new Error('gateway_unreachable') as GatewayFailure;
    error.errorClass =
      cause instanceof Error && cause.name === 'AbortError'
        ? 'timeout'
        : 'offline';
    throw error;
  }
  if (!response.ok) {
    const error = new Error(
      `gateway_http_${response.status}`
    ) as GatewayFailure;
    error.status = response.status;
    error.errorClass = response.status >= 500 ? 'error' : 'invalid_response';
    throw error;
  }
  const data = await response.json().catch(() => null);
  if (!data || typeof data !== 'object') {
    const error = new Error('gateway_malformed_response') as GatewayFailure;
    error.errorClass = 'invalid_response';
    throw error;
  }
  return data;
}

function contextFromInput(input: any): any {
  const raw = safeObject(input?.context);
  return {
    lead_session_id: text(raw.session_id, 128),
    page_path: text(raw.page_path, 1000),
    page_url: text(raw.page_url, 2000),
    landing_page: text(raw.landing_page, 2000),
    referrer: text(raw.initial_referrer || raw.referrer, 2000),
    pages_viewed: safePages(raw.pages_viewed),
    attribution: {
      source: text(raw.source, 500),
      utm_source: text(raw.utm_source, 500),
      utm_medium: text(raw.utm_medium, 500),
      utm_campaign: text(raw.utm_campaign, 500),
      utm_content: text(raw.utm_content, 500),
      utm_term: text(raw.utm_term, 500),
      yclid: text(raw.yclid, 500),
      gclid: text(raw.gclid, 500),
    },
  };
}

async function createSession(
  sb: any,
  input: any,
  origin: string
): Promise<any> {
  if (input?.privacy_consent !== true) {
    throw new Error('privacy_consent_required');
  }
  const turnstileOk = await verifyTurnstile(
    text(input?.turnstile_token, 3000),
    origin
  ).catch(() => false);
  if (!turnstileOk) throw new Error('turnstile_failed');

  const token = randomToken();
  const context = contextFromInput(input);
  const { data, error } = await sb
    .from('ai_chat_sessions')
    .insert({
      client_token_hash: await sha256(token),
      ...context,
      metadata: {
        privacy_consent: true,
        privacy_consent_at: new Date().toISOString(),
        privacy_policy_version:
          text(input?.privacy_policy_version, 64) || '2026-08-07',
      },
    })
    .select('*')
    .single();
  if (error || !data) throw new Error('session_create_failed');
  return { session: data, sessionToken: token };
}

async function loadSession(sb: any, input: any): Promise<any> {
  const id = text(input?.session_id, 64);
  const token = text(input?.session_token, 128);
  if (!id || !token) throw new Error('invalid_session');
  const { data, error } = await sb
    .from('ai_chat_sessions')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) throw new Error('invalid_session');
  const tokenHash = await sha256(token);
  if (tokenHash !== data.client_token_hash) throw new Error('invalid_session');
  return { session: data, sessionToken: null };
}

async function sessionForRequest(
  sb: any,
  input: any,
  origin: string
): Promise<any> {
  return input?.session_id
    ? loadSession(sb, input)
    : createSession(sb, input, origin);
}

async function loadMessages(
  sb: any,
  sessionId: string,
  limit = 40
): Promise<any[]> {
  const { data, error } = await sb
    .from('ai_chat_messages')
    .select('id,created_at,role,content,delivery_status,model')
    .eq('session_id', sessionId)
    .in('role', ['user', 'assistant'])
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error('message_history_failed');
  return [...(data || [])].reverse();
}

async function activePrompt(sb: any): Promise<string> {
  const { data } = await sb
    .from('ai_chat_prompts')
    .select('content')
    .eq('active', true)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();
  return text(data?.content, 20_000);
}

async function retrieveKnowledge(
  sb: any,
  message: string,
  pagePath: string,
  id: string
): Promise<{ chunks: any[]; latencyMs: number }> {
  const started = Date.now();
  const embeddingResponse = await gatewayRequest(
    '/v1/embed',
    {
      input: [message],
      model: env('EMBEDDING_MODEL') || 'embeddinggemma',
      request_id: id,
    },
    Number(env('LOCAL_AI_EMBED_TIMEOUT_MS') || 12_000)
  );
  const embedding = embeddingResponse?.embeddings?.[0];
  if (!Array.isArray(embedding) || embedding.length !== 768) {
    const error = new Error('embedding_dimension_mismatch') as GatewayFailure;
    error.errorClass = 'invalid_response';
    throw error;
  }
  const metadataFilter = pagePath.startsWith('/medicine')
    ? { vertical: 'medicine' }
    : pagePath.startsWith('/hse')
      ? { vertical: 'hse' }
      : {};
  let result = await sb.rpc('search_knowledge_chunks', {
    query_embedding: embedding,
    query_text: message,
    match_count: 6,
    filter_metadata: metadataFilter,
  });
  if (
    !result.error &&
    !result.data?.length &&
    Object.keys(metadataFilter).length
  ) {
    result = await sb.rpc('search_knowledge_chunks', {
      query_embedding: embedding,
      query_text: message,
      match_count: 6,
      filter_metadata: {},
    });
  }
  if (result.error) throw new Error('retrieval_failed');
  return { chunks: result.data || [], latencyMs: Date.now() - started };
}

function knowledgeContext(chunks: any[]): string {
  if (!chunks.length) return 'Подходящих подтверждённых источников не найдено.';
  return chunks
    .map(
      (chunk, index) =>
        `[${index + 1}] ${chunk.title}\nИсточник: ${chunk.source_url || 'внутренняя база Anix'}\n${chunk.content}`
    )
    .join('\n\n---\n\n')
    .slice(0, 24_000);
}

function parseModelEnvelope(value: unknown): any {
  const raw = text(value, 24_000)
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { reply: raw };
  }
  const qualification = safeObject(parsed?.qualification);
  const cleanQualification: Record<string, string> = {};
  for (const key of [
    'name',
    'company',
    'role',
    'contact',
    'task_type',
    'industry',
    'audience',
    'format',
    'deadline',
    'budget',
    'current_problem',
    'desired_next_step',
  ]) {
    cleanQualification[key] = text(qualification[key], 500);
  }
  return {
    reply: text(parsed?.reply, 6000),
    qualification: cleanQualification,
    commercial_readiness: ['cold', 'exploring', 'qualified', 'ready'].includes(
      parsed?.commercial_readiness
    )
      ? parsed.commercial_readiness
      : 'exploring',
    should_create_lead: parsed?.should_create_lead === true,
    summary: text(parsed?.summary, 3000),
    recommended_next_action: text(parsed?.recommended_next_action, 1000),
  };
}

function mergeQualification(current: any, patch: any): any {
  const result = { ...safeObject(current) };
  for (const [key, value] of Object.entries(safeObject(patch))) {
    const clean = text(value, 500);
    if (clean) result[key] = clean;
  }
  return result;
}

function extractContact(message: string): any {
  const email =
    message.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || '';
  const telegram =
    message.match(
      /(?:https?:\/\/t\.me\/|@)([A-Za-z][A-Za-z0-9_]{4,31})/i
    )?.[0] || '';
  const phoneCandidate =
    message.match(/(?:\+?\d[\d\s().-]{8,}\d)/)?.[0]?.trim() || '';
  const phone =
    phoneCandidate.replace(/\D/g, '').length >= 10 ? phoneCandidate : '';
  return {
    email,
    phone,
    telegram,
    explicit: Boolean(email || phone || telegram),
  };
}

function normalizedContact(qualification: any, deterministic: any): any {
  const fromModel = extractContact(text(qualification?.contact, 500));
  return {
    email: deterministic.email || fromModel.email || '',
    phone: deterministic.phone || fromModel.phone || '',
    telegram: deterministic.telegram || fromModel.telegram || '',
  };
}

async function storeAssistantFallback(
  sb: any,
  session: any,
  id: string,
  started: number,
  errorClass: string,
  sessionToken: string | null,
  origin: string
): Promise<Response> {
  await sb.from('ai_chat_messages').insert({
    session_id: session.id,
    request_id: id,
    role: 'assistant',
    content: FALLBACK_REPLY,
    delivery_status: 'fallback',
    total_latency_ms: Date.now() - started,
    error_class: errorClass,
  });
  await sb
    .from('ai_chat_sessions')
    .update({
      updated_at: new Date().toISOString(),
      last_message_at: new Date().toISOString(),
      llm_status: ['offline', 'timeout'].includes(errorClass)
        ? errorClass
        : 'error',
      last_error_class: errorClass,
      message_count: Number(session.message_count || 0) + 2,
    })
    .eq('id', session.id);

  console.info(
    JSON.stringify({
      event: 'ai_chat_request',
      request_id: id,
      session_id: session.id,
      status: 'fallback',
      error_class: errorClass,
      total_latency_ms: Date.now() - started,
    })
  );
  return json(
    {
      ok: true,
      fallback: true,
      reply: FALLBACK_REPLY,
      session_id: session.id,
      session_token: sessionToken || undefined,
      llm_status: errorClass,
    },
    200,
    origin
  );
}

function transcriptText(messages: any[]): string {
  return messages
    .slice(-40)
    .map(
      (item) =>
        `${item.role === 'user' ? 'Посетитель' : 'Anix'}: ${item.content}`
    )
    .join('\n\n')
    .slice(0, 12_000);
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

async function syncChatLead(
  sb: any,
  session: any,
  messages: any[],
  qualification: any,
  contact: any,
  recommendedNextAction: string
): Promise<string> {
  if (!contact.email && !contact.phone && !contact.telegram)
    return 'not_requested';
  await sb
    .from('ai_chat_sessions')
    .update({ crm_sync_status: 'pending', crm_sync_error: null })
    .eq('id', session.id);

  const note = [
    'Квалифицированный диалог AI-консультанта Anix',
    '',
    `Имя: ${qualification.name || '—'}`,
    `Компания: ${qualification.company || '—'}`,
    `Роль: ${qualification.role || '—'}`,
    `Отрасль: ${qualification.industry || '—'}`,
    `Тип задачи: ${qualification.task_type || '—'}`,
    `Аудитория: ${qualification.audience || '—'}`,
    `Формат: ${qualification.format || '—'}`,
    `Срок: ${qualification.deadline || '—'}`,
    `Бюджет: ${qualification.budget || '—'}`,
    `Текущая проблема: ${qualification.current_problem || '—'}`,
    `Желаемый шаг: ${qualification.desired_next_step || '—'}`,
    `Рекомендованное действие: ${recommendedNextAction || '—'}`,
    '',
    `Страница: ${session.page_url || session.page_path || '—'}`,
    `Landing page: ${session.landing_page || '—'}`,
    `Referrer: ${session.referrer || '—'}`,
    `Атрибуция: ${JSON.stringify(session.attribution || {})}`,
    '',
    'Маршрут:',
    routeSummary(session.pages_viewed || []) || '—',
    '',
    'Диалог:',
    transcriptText(messages),
    '',
    'AI Chat Session ID:',
    session.id,
  ].join('\n');

  try {
    const result = await syncAmoLead({
      sourceId: session.id,
      markerLabel: 'AI Chat Session ID',
      leadName: `AI-чат сайта — ${qualification.company || qualification.name || 'новый запрос'}`,
      contactName:
        qualification.name || qualification.company || 'Контакт из AI-чата',
      company: qualification.company,
      email: contact.email,
      phone: contact.phone,
      telegram: contact.telegram,
      note,
      tags: ['website', 'website-ai-chat'],
      existingContactId: session.amocrm_contact_id,
      existingLeadId: session.amocrm_lead_id,
      retryAttempt: session.crm_sync_status === 'error' ? 2 : 1,
    });
    await sb
      .from('ai_chat_sessions')
      .update({
        status: 'handed_off',
        crm_sync_status: 'completed',
        crm_sync_error: null,
        amocrm_account_id: result.accountId,
        amocrm_lead_id: result.leadId,
        amocrm_contact_id: result.contactId,
        amocrm_pipeline_id: result.pipelineId,
        amocrm_status_id: result.statusId,
      })
      .eq('id', session.id);
    return 'completed';
  } catch (error) {
    const safeError = text(
      error instanceof Error ? error.message : 'amocrm_error',
      500
    );
    await sb
      .from('ai_chat_sessions')
      .update({ crm_sync_status: 'error', crm_sync_error: safeError })
      .eq('id', session.id);
    if (!(error instanceof AmoIntegrationError)) {
      console.error(`[ai-chat] CRM sync failed: ${safeError}`);
    }
    return 'error';
  }
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

  let input: any;
  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
      return json({ error: 'payload_too_large' }, 413, origin);
    }
    input = JSON.parse(raw || '{}');
  } catch {
    return json({ error: 'invalid_json' }, 400, origin);
  }

  const started = Date.now();
  const id = requestId(input?.request_id);
  let sb: any;
  try {
    sb = await createSupabaseClient();
    const rate = await enforceRateLimit(sb, req);
    if (!rate.allowed) {
      return json(
        {
          error: 'rate_limited',
          retry_after_seconds: rate.retry_after_seconds,
        },
        429,
        origin
      );
    }
  } catch (error) {
    console.error(
      `[ai-chat] bootstrap failed: ${error instanceof Error ? error.message : 'unknown'}`
    );
    return json({ error: 'service_unavailable' }, 503, origin);
  }

  let sessionResult: any;
  try {
    sessionResult = await sessionForRequest(sb, input, origin);
  } catch (error) {
    const code = error instanceof Error ? error.message : 'invalid_session';
    const status =
      code === 'turnstile_failed'
        ? 400
        : code === 'privacy_consent_required'
          ? 400
          : 401;
    return json({ error: code }, status, origin);
  }
  const session = sessionResult.session;

  if (input?.action === 'resume') {
    const messages = await loadMessages(sb, session.id).catch(() => []);
    return json(
      {
        ok: true,
        session_id: session.id,
        messages,
        llm_status: session.llm_status,
        qualification: session.qualification,
      },
      200,
      origin
    );
  }

  const message = text(input?.message, MAX_MESSAGE_LENGTH);
  if (message.length < 2)
    return json({ error: 'invalid_message' }, 400, origin);

  const existing = await sb
    .from('ai_chat_messages')
    .select('role,content,delivery_status,model')
    .eq('request_id', id)
    .eq('role', 'assistant')
    .maybeSingle();
  if (existing.data) {
    return json(
      {
        ok: true,
        duplicate: true,
        reply: existing.data.content,
        fallback: existing.data.delivery_status === 'fallback',
        session_id: session.id,
      },
      200,
      origin
    );
  }

  const userInsert = await sb.from('ai_chat_messages').insert({
    session_id: session.id,
    request_id: id,
    role: 'user',
    content: message,
    delivery_status: 'stored',
    metadata: { page_path: text(input?.context?.page_path, 1000) },
  });
  if (userInsert.error && userInsert.error.code !== '23505') {
    return json({ error: 'message_store_failed' }, 500, origin);
  }

  let retrieval: any;
  let history: any[];
  let prompt: string;
  try {
    [retrieval, history, prompt] = await Promise.all([
      retrieveKnowledge(sb, message, session.page_path || '', id),
      loadMessages(sb, session.id, MAX_HISTORY_MESSAGES),
      activePrompt(sb),
    ]);
    if (!prompt) throw new Error('system_prompt_missing');
  } catch (error) {
    const errorClass =
      (error as GatewayFailure)?.errorClass || 'retrieval_error';
    return storeAssistantFallback(
      sb,
      session,
      id,
      started,
      errorClass,
      sessionResult.sessionToken,
      origin
    );
  }

  const llmStarted = Date.now();
  let gateway: any;
  try {
    gateway = await gatewayRequest(
      '/v1/chat',
      {
        request_id: id,
        messages: history.map((item) => ({
          role: item.role,
          content: item.content,
        })),
        system_prompt: prompt,
        retrieved_context: knowledgeContext(retrieval.chunks),
        model: env('CHAT_MODEL') || 'qwen3:8b',
        model_parameters: {
          temperature: 0.35,
          num_ctx: Number(env('CHAT_NUM_CTX') || 8192),
          format: 'json',
          think: false,
        },
      },
      Number(env('LOCAL_AI_CHAT_TIMEOUT_MS') || 45_000)
    );
  } catch (error) {
    const errorClass = (error as GatewayFailure)?.errorClass || 'llm_error';
    return storeAssistantFallback(
      sb,
      session,
      id,
      started,
      errorClass,
      sessionResult.sessionToken,
      origin
    );
  }

  const envelope = parseModelEnvelope(
    gateway?.message?.content || gateway?.content
  );
  if (!envelope.reply) {
    return storeAssistantFallback(
      sb,
      session,
      id,
      started,
      'invalid_response',
      sessionResult.sessionToken,
      origin
    );
  }

  const llmLatency = Date.now() - llmStarted;
  const deterministicContact = extractContact(message);
  const qualification = mergeQualification(
    session.qualification,
    envelope.qualification
  );
  const contact = {
    ...safeObject(session.contact),
    ...normalizedContact(qualification, deterministicContact),
  };
  const chunkIds = retrieval.chunks.map((chunk: any) => chunk.id);

  const assistantInsert = await sb.from('ai_chat_messages').insert({
    session_id: session.id,
    request_id: id,
    role: 'assistant',
    content: envelope.reply,
    delivery_status: 'completed',
    retrieved_chunk_ids: chunkIds,
    model: text(gateway?.model, 200) || env('CHAT_MODEL') || 'qwen3:8b',
    retrieval_latency_ms: retrieval.latencyMs,
    llm_latency_ms: llmLatency,
    total_latency_ms: Date.now() - started,
    metadata: {
      usage: safeObject(gateway?.usage),
      retrieval: retrieval.chunks.map((chunk: any) => ({
        id: chunk.id,
        title: text(chunk.title, 300),
        vertical: text(chunk.metadata?.vertical, 50),
        similarity: Number(chunk.similarity || 0),
        lexical_rank: Number(chunk.lexical_rank || 0),
        retrieval_score: Number(chunk.retrieval_score || 0),
      })),
    },
  });
  if (assistantInsert.error)
    return json({ error: 'message_store_failed' }, 500, origin);

  const update = {
    updated_at: new Date().toISOString(),
    last_message_at: new Date().toISOString(),
    llm_status: 'online',
    last_error_class: null,
    message_count: Number(session.message_count || 0) + 2,
    qualification,
    contact,
    summary: envelope.summary || session.summary,
    recommended_next_action:
      envelope.recommended_next_action || session.recommended_next_action,
    commercial_readiness: envelope.commercial_readiness,
    status:
      envelope.commercial_readiness === 'qualified' ||
      envelope.commercial_readiness === 'ready'
        ? 'qualified'
        : session.status,
  };
  await sb.from('ai_chat_sessions').update(update).eq('id', session.id);

  const refreshedMessages = [
    ...history,
    { role: 'assistant', content: envelope.reply },
  ];
  const shouldSync =
    deterministicContact.explicit ||
    (envelope.should_create_lead &&
      Boolean(contact.email || contact.phone || contact.telegram));
  const crmSync = shouldSync
    ? await syncChatLead(
        sb,
        { ...session, ...update },
        refreshedMessages,
        qualification,
        contact,
        update.recommended_next_action || ''
      )
    : 'not_requested';

  console.info(
    JSON.stringify({
      event: 'ai_chat_request',
      request_id: id,
      session_id: session.id,
      status: 'completed',
      retrieval_latency_ms: retrieval.latencyMs,
      llm_latency_ms: llmLatency,
      total_latency_ms: Date.now() - started,
      model: text(gateway?.model, 200),
      retrieved_chunks: chunkIds.length,
      context_chars: knowledgeContext(retrieval.chunks).length,
      crm_sync: crmSync,
    })
  );

  return json(
    {
      ok: true,
      reply: envelope.reply,
      fallback: false,
      session_id: session.id,
      session_token: sessionResult.sessionToken || undefined,
      llm_status: 'online',
      qualification,
      crm_sync: crmSync,
    },
    200,
    origin
  );
}

if (typeof Deno !== 'undefined' && typeof Deno.serve === 'function') {
  Deno.serve(handler);
}

export default handler;
