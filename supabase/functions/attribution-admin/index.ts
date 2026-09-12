declare const Deno: any;
// @ts-ignore Deno explicit extension
import { database, env, hash, readBody, reply, serviceKey } from '../_shared/attribution-server.ts';
// @ts-ignore Deno explicit extension
import { listAttributionFields, resolveAttributionFields, provisionAttributionFields, enrichAttributionLead } from '../_shared/amocrm.ts';

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return reply({ error: 'method_not_allowed' }, 405);
  const secret = serviceKey();
  const botSecret = env('TELEGRAM_ATTRIBUTION_BOT_SECRET');
  const authorization = req.headers.get('authorization');
  const isAdmin = Boolean(secret && authorization === `Bearer ${secret}`);
  const isBot = Boolean(botSecret && authorization === `Bearer ${botSecret}`);
  if (!isAdmin && !isBot) return reply({ error: 'unauthorized' }, 401);
  try {
    const input = await readBody(req, 4000);
    if (!isAdmin && !['redeem', 'link_deal'].includes(input.action)) return reply({ error: 'forbidden' }, 403);
    if (input.action === 'audit') {
      const fields = await listAttributionFields();
      return reply({ fields: fields.map(({ id, name, code, type }) => ({ id, name, code, type })), mapping: resolveAttributionFields(fields) });
    }
    const sb = await database();
    if (input.action === 'provision') {
      const lock = await sb.rpc('website_attribution_quota', { p_key: 'crm_fields_lease', p_limit: 1, p_seconds: 900 });
      if (lock.error || !lock.data) return reply({ error: 'provision_in_progress' }, 409);
      try { return reply({ mapping: await provisionAttributionFields() }); }
      finally { await sb.from('website_attribution_limits').delete().eq('key', 'crm_fields_lease'); }
    }
    if (input.action === 'reconcile') {
      let synced = 0, pending = 0;
      for (const table of ['website_leads', 'ai_chat_sessions']) {
        const { data, error } = await sb.from(table).select('id,amocrm_lead_id,attribution_snapshot')
          .eq('attribution_crm_synced', false).not('amocrm_lead_id', 'is', null).limit(20);
        if (error) throw new Error('database_unavailable');
        for (const row of data || []) {
          if (await enrichAttributionLead(row.amocrm_lead_id, row.attribution_snapshot)) {
            const update = await sb.from(table).update({ attribution_crm_synced: true }).eq('id', row.id);
            if (update.error) pending++; else synced++;
          } else pending++;
        }
      }
      return reply({ synced, pending });
    }
    if (input.action === 'redeem') {
      if (!/^[a-f0-9]{32}$/.test(input.token) || !/^\d{1,20}$/.test(String(input.telegram_user_id || ''))) return reply({ error: 'invalid_token' }, 400);
      const subject = await hash(`telegram:${input.telegram_user_id}:${secret}`);
      const { data, error } = await sb.rpc('redeem_website_attribution', { p_token: input.token, p_subject_hash: subject });
      if (error) throw new Error('database_unavailable');
      return reply(data);
    }
    if (input.action === 'link_deal') {
      if (!/^[a-f0-9]{32}$/.test(input.token) || !Number.isSafeInteger(input.amocrm_lead_id) || input.amocrm_lead_id <= 0 || !/^\d{1,20}$/.test(String(input.telegram_user_id || ''))) return reply({ error: 'invalid_link' }, 400);
      const { data, error } = await sb.from('website_attribution_tokens').update({ amocrm_lead_id: input.amocrm_lead_id })
        .eq('token', input.token).eq('telegram_subject_hash', await hash(`telegram:${input.telegram_user_id}:${secret}`))
        .is('amocrm_lead_id', null).select('token');
      if (error) throw new Error('database_unavailable');
      return reply({ ok: Boolean(data?.length) });
    }
    return reply({ error: 'bad_action' }, 400);
  } catch (error) {
    console.warn('[attribution-admin]', error instanceof Error ? error.message : 'operation_failed');
    return reply({ error: 'operation_failed' }, 503);
  }
}
if (typeof Deno !== 'undefined' && Deno.serve) Deno.serve(handler);
