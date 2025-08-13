import { CONFIG } from '@/config';

export async function track(event: string, payload: Record<string, any> = {}) {
  const url = CONFIG.TRACK_EVENT_URL;
  if (!url) return;

  const send = () =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, meta: payload }),
    });

  try {
    await send();
  } catch {
    setTimeout(() => {
      send().catch(() => {});
    }, 1000);
  }
}
