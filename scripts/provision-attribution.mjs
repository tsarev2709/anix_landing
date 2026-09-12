// Runs only in trusted deployment CI. Never writes credentials to disk or logs.
const ref = 'ppoygmaqlaiqcisjetea';
const managementToken = process.env.SUPABASE_ACCESS_TOKEN;
if (!managementToken) throw new Error('SUPABASE_ACCESS_TOKEN is required');
const keysResponse = await fetch(`https://api.supabase.com/v1/projects/${ref}/api-keys`, {
  headers: { Authorization: `Bearer ${managementToken}` }, signal: AbortSignal.timeout(20000),
});
if (!keysResponse.ok) throw new Error(`Project key lookup failed: ${keysResponse.status}`);
const keys = await keysResponse.json();
const key = keys.find(item => item.name === 'service_role')?.api_key;
if (!key) throw new Error('Existing service_role key is unavailable');
const endpoint = `https://${ref}.supabase.co/functions/v1/attribution-admin`;
for (const action of ['audit','provision','reconcile']) {
  const response = await fetch(endpoint, { method: 'POST',
    headers: { Authorization: `Bearer ${key}`, apikey: key, 'Content-Type': 'application/json' },
    body: JSON.stringify({action}), signal: AbortSignal.timeout(120000),
  });
  if (!response.ok) throw new Error(`Attribution ${action} failed: ${response.status}`);
  const result = await response.json();
  if (action === 'audit') console.log('Existing deal fields:', JSON.stringify(result.fields));
  else console.log(action, JSON.stringify(result));
}
