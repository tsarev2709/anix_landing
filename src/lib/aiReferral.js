// An observable attribution hint, never proof that an AI recommended the studio.
const PROVIDERS = [
  ['chatgpt', ['chatgpt.com', 'chat.openai.com']],
  ['perplexity', ['perplexity.ai']],
  ['gemini', ['gemini.google.com']],
  ['claude', ['claude.ai']],
  ['copilot', ['copilot.microsoft.com']],
  ['alice', ['alice.yandex.ru', 'alice.yandex.com']],
];
function providerForHost(host) {
  const normalized = String(host || '').toLowerCase().replace(/\.$/, '');
  return PROVIDERS.find(([, hosts]) => hosts.some(domain => normalized === domain || normalized.endsWith(`.${domain}`)))?.[0] || '';
}
export function classifyAiReferral({ utmSource = '', referrer = '' } = {}) {
  let host = '';
  try { host = new URL(referrer).hostname; } catch { /* No observable referrer. */ }
  const referrerProvider = providerForHost(host);
  const normalizedUtm = String(utmSource).toLowerCase().trim();
  const utmProvider = PROVIDERS.find(([name]) => name === normalizedUtm)?.[0] || providerForHost(normalizedUtm);
  // Existing campaign attribution wins. Contradictory hints are surfaced, not overwritten.
  if (normalizedUtm) return { provider: utmProvider, evidence: utmProvider ? 'utm' : 'other_campaign', conflict: Boolean(referrerProvider && referrerProvider !== utmProvider) };
  if (referrerProvider) return { provider: referrerProvider, evidence: 'referrer', conflict: false };
  return { provider: '', evidence: host ? 'other_referrer' : 'unattributed', conflict: false };
}
