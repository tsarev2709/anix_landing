import { createClient } from '@supabase/supabase-js';

const telegramRegex = /^(@?[a-zA-Z0-9_]{5,32}|https?:\/\/t\.me\/[a-zA-Z0-9_]{5,32}|tg:\/\/resolve\?domain=[a-zA-Z0-9_]{5,32})$/;

function buildTags(email: string, position: string): string[] {
  const tags: string[] = [];
  const domain = email.split('@')[1]?.toLowerCase() || '';
  const pos = position.toLowerCase();

  const domainMap: { regex: RegExp; tag: string }[] = [
    { regex: /(edu|ac)/i, tag: 'education' },
    { regex: /(pharm|bio|med|clinic|dent)/i, tag: 'biotech_med' },
    { regex: /(ai|tech|dev|it|soft)/i, tag: 'it' },
    { regex: /(realty|estate|devel|stroy|строй)/i, tag: 'real_estate_construction' },
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

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const { email, position, telegram, consent, captchaToken, utm, referrer, pathname } = await req.json();

    if (!email || !telegram || !telegramRegex.test(telegram) || consent !== true) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
    }

    const turnstileSecret = Deno.env.get('TURNSTILE_SECRET_KEY') || process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      return new Response(JSON.stringify({ error: 'Server misconfigured' }), { status: 500 });
    }

    const turnRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: turnstileSecret, response: captchaToken }),
    });
    const turnJson = await turnRes.json();
    if (!turnJson.success) {
      return new Response(JSON.stringify({ error: 'Captcha verification failed' }), { status: 400 });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || process.env.SUPABASE_URL;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || '';
    const tags = buildTags(email, position || '');
    const { data, error } = await supabase
      .from('leads')
      .insert({ email, position, telegram, consent, utm, referrer, pathname, ip, tags })
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
    }

    const leadId = data.id;
    const resendKey = Deno.env.get('RESEND_API_KEY') || process.env.RESEND_API_KEY;
    const supabaseUrlEnv = supabaseUrl;
    const htmlContent =
      `<p>Спасибо за интерес!</p>` +
      `<img src="${supabaseUrlEnv}/functions/v1/email-open?lead_id=${leadId}&t=${Date.now()}" width="1" height="1" style="display:none" alt="">`;

    await fetch('https://api.resend.com/emails', {
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

    return new Response(JSON.stringify({ ok: true, leadId }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 500 });
  }
}

