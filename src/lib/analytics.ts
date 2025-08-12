export async function track(event: string, payload: Record<string, any> = {}) {
  const url = process.env.NEXT_PUBLIC_TRACK_EVENT_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, meta: payload }),
    });
  } catch {
    // ignore
  }
}
