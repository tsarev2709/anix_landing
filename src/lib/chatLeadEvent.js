const reported = new Set();
export function reportChatLeadOnce(sessionId, send) {
  if (!sessionId || reported.has(sessionId)) return;
  const key = 'anix_chat_lead_' + sessionId;
  try { if (sessionStorage.getItem(key)) return; } catch { /* memory fallback */ }
  reported.add(sessionId);
  try { sessionStorage.setItem(key, '1'); } catch { /* tracking must not block chat */ }
  try { Promise.resolve(send()).catch(() => {}); } catch { /* analytics failure */ }
}
