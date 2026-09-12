import { CONFIG } from '@/config';
import { postJson } from './net';
import {
  createLeadIdempotencyKey,
  getLeadSessionSnapshot,
  setAttributionEventSink,
} from './leadSession';
import { marketingValue, safePage } from './attribution';

const aliases: Record<string, string> = {
  cta_telegram: 'telegram_click',
  cta_email: 'email_click',
  open_case: 'case_open',
  lead_form_start: 'form_start',
  lead_form_submit: 'form_submit',
  lead_form_success: 'form_success',
  lead_form_error: 'form_error',
  ai_chat_open: 'llm_open',
  ai_chat_message: 'llm_message',
  ai_chat_lead: 'llm_lead',
};
export function eventContext(payload: Record<string, any> = {}) {
  try {
    const snapshot = getLeadSessionSnapshot().attribution_snapshot;
    const safe: Record<string, any> = {};
    for (const key of [
      'form_variant',
      'form_version',
      'cta_id',
      'formId',
      'error_type',
      'task_id',
      'section',
      'reason',
      'rating',
      'from',
      'to',
    ]) {
      if (typeof payload[key] === 'string')
        safe[key] = marketingValue(payload[key]);
    }
    return {
      ...safe,
      path: safePage(
        payload.path || payload.page_path || window.location.pathname
      ),
      visitor_id: snapshot?.visitor_id,
      session_id: snapshot?.session_id,
      timestamp: new Date().toISOString(),
      attribution_snapshot: snapshot,
    };
  } catch {
    return {};
  }
}

export async function track(event: string, payload: Record<string, any> = {}) {
  const url = CONFIG.TRACK_EVENT_URL;
  if (!url) return;

  const meta = eventContext(payload);
  const body = {
    event: aliases[event] || event,
    event_id: createLeadIdempotencyKey(),
    meta,
  };
  const send = () => postJson(url, body);

  try {
    await send();
  } catch {
    setTimeout(() => {
      send().catch(() => {});
    }, 1000);
  }
}
setAttributionEventSink((event: string, payload: Record<string, any>) => {
  void track(event, payload).catch(() => {});
});
