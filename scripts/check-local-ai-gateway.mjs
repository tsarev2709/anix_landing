const base = (
  process.env.LOCAL_AI_GATEWAY_LOCAL_URL || 'http://127.0.0.1:8788'
).replace(/\/+$/, '');
const secret = process.env.LOCAL_AI_GATEWAY_SECRET || '';

if (!secret) {
  console.error('Set LOCAL_AI_GATEWAY_SECRET before running gateway:check.');
  process.exit(1);
}

const response = await fetch(`${base}/health`, {
  headers: { Authorization: `Bearer ${secret}` },
});
const body = await response.json().catch(() => ({}));
console.log(JSON.stringify(body, null, 2));
if (!response.ok || body.ok !== true) process.exit(1);
