const ORIGIN = 'https://studio.anix-ai.pro';
const CORS = {
  'Access-Control-Allow-Origin': ORIGIN,
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

const telegramRegex =
  /^(@?[a-zA-Z0-9_]{5,32}|https?:\/\/t\.me\/[a-zA-Z0-9_]{5,32}|tg:\/\/resolve\?domain=[a-zA-Z0-9_]{5,32})$/;

function buildTags(email: string, position: string): string[] {
  const tags: string[] = [];
  const domain = email.split('@')[1]?.toLowerCase() || '';
  const pos = position.toLowerCase();

  const domainMap: { regex: RegExp; tag: string }[] = [
    { regex: /(edu|ac)/i, tag: 'education' },
    { regex: /(pharm|bio|med|clinic|dent)/i, tag: 'biotech_med' },
    { regex: /(ai|tech|dev|it|soft)/i, tag: 'it' },
    {
      regex: /(realty|estate|devel|stroy|строй)/i,
      tag: 'real_estate_construction',
    },
    { regex: /(gmail|yahoo|outlook|bk|mail\.ru|yandex)/i, tag: 'b2c' },
  ];
  for (const m of domainMap) {
    if (m.regex.test(domain)) tags.push(m.tag);
  }

  const posMap: { regex: RegExp; tag: string }[] = [
    { regex: /(CEO|Founder|Директор|Сооснователь)/i, tag: 'decision_maker' },
    { regex: /(CMO|Маркетинг|Growth|Продажи)/i, tag: 'marketing_sales' },
    { regex: /(CTO|Разработ|Инженер|Тех)/i, tag: 'tech' },
    { regex: /Product/i, tag: 'product' },
    { regex: /(Doctor|Dentist|Врач|Стоматолог)/i, tag: 'medical' },
  ];
  for (const m of posMap) {
    if (m.regex.test(pos)) tags.push(m.tag);
  }

  return Array.from(new Set(tags));
}

async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  try {
    const {
      email,
      position,
      telegram,
      consent,
      captchaToken,
      utm,
      referrer,
      pathname,
    } = await req.json();

    if (
      !email ||
      !telegram ||
      !telegramRegex.test(telegram) ||
      consent !== true
    ) {
      return json({ error: 'invalid_input' }, 400);
    }

    const turnstileSecret = Deno.env.get('TURNSTILE_SECRET_KEY') ||
      process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) return json({ error: 'misconfigured' }, 500);

    const turnRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: turnstileSecret, response: captchaToken }),
    });
    const turnJson = await turnRes.json();
    if (!turnJson.success) return json({ error: 'Captcha verification failed' }, 400);

    const SB_URL = Deno.env.get('SB_URL') || process.env.SB_URL;
    const SB_SERVICE_ROLE_KEY =
      Deno.env.get('SB_SERVICE_ROLE_KEY') || process.env.SB_SERVICE_ROLE_KEY;
    if (!SB_URL || !SB_SERVICE_ROLE_KEY) return json({ error: 'misconfigured' }, 500);

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const sb = createClient(SB_URL, SB_SERVICE_ROLE_KEY);

    const ip =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('cf-connecting-ip') ||
      '';
    const tags = buildTags(email, position || '');
    const { data, error } = await sb
      .from('leads')
      .insert({
        email,
        position,
        telegram,
        consent,
        utm,
        referrer,
        pathname,
        ip,
        tags,
      })
      .select()
      .single();

    if (error) return json({ error: 'Database error' }, 500);

    const leadId = data.id;
    const resendKey = Deno.env.get('RESEND_API_KEY') || process.env.RESEND_API_KEY;
    if (!resendKey) return json({ error: 'misconfigured' }, 500);

    const htmlContent =
      `<p>Спасибо за интерес!</p>` +
      `<img src="${SB_URL}/functions/v1/email-open?lead_id=${leadId}&t=${Date.now()}" width="1" height="1" style="display:none" alt="">`;

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'hello@anix-ai.pro',
        to: email,
        subject: 'Спасибо!',
        html: htmlContent,
      }),
    });
    if (!emailRes.ok) {
      const detail = await emailRes.text().catch(() => '');
      return json({ error: 'resend_error', detail }, 502);
    }

    return json({ ok: true, leadId });
  } catch (err) {
    return json({ error: 'Unexpected error' }, 500);
  }
}

if (typeof Deno !== 'undefined' && typeof (Deno as any).serve === 'function') {
  (Deno as any).serve(handler);
}
export default handler;
