import { CONFIG } from '@/config';
import { postJson } from './net';

export async function track(event: string, payload: Record<string, any> = {}) {
  const url = CONFIG.TRACK_EVENT_URL;
  if (!url) return;

  const send = () => postJson(url, { event, meta: payload });

  try {
    await send();
  } catch {
    setTimeout(() => {
      send().catch(() => {});
    }, 1000);
  }
}
