import React from 'react';
import { CONFIG } from '../config';
import { postJson, trackEvent } from '../lib/net';

declare global {
  interface Window {
    turnstile?: any;
  }
}

export default function LeadForm() {
  const [email, setEmail] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [telegram, setTelegram] = React.useState('');
  const [consent, setConsent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const siteKey = CONFIG.TURNSTILE_SITE_KEY;

  const captchaRef = React.useRef<HTMLDivElement>(null);
  const captchaId = React.useRef<any>(null);
  const tokenRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!siteKey) return;
    if (document.getElementById('cf-turnstile')) return;
    const s = document.createElement('script');
    s.id = 'cf-turnstile';
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }, [siteKey]);

  React.useEffect(() => {
    if (!siteKey) return;
    const i = setInterval(() => {
      if (window.turnstile && captchaRef.current && !captchaId.current) {
        captchaId.current = window.turnstile.render(captchaRef.current, {
          sitekey: siteKey,
          theme: 'dark',
          size: 'invisible',
          callback: (t: string) => {
            tokenRef.current = t;
          },
        });
        clearInterval(i);
      }
    }, 100);
    return () => clearInterval(i);
  }, [siteKey]);

  async function ensureToken(timeoutMs = 8000) {
    if (tokenRef.current) return tokenRef.current;
    if (!window.turnstile || !captchaId.current)
      throw new Error('captcha_not_ready');
    const p = new Promise<string>((resolve, reject) => {
      const to = setTimeout(
        () => reject(new Error('captcha_timeout')),
        timeoutMs
      );
      const cb = (t: string) => {
        clearTimeout(to);
        resolve(t);
      };
      window.turnstile.render(captchaRef.current, {
        sitekey: siteKey,
        theme: 'dark',
        size: 'invisible',
        callback: cb,
      });
      window.turnstile.execute(captchaId.current);
    });
    const t = await p;
    tokenRef.current = t;
    return t;
  }

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setError(null);
    if (!CONFIG.SUBMIT_LEAD_URL) {
      setError('Ошибка конфигурации формы.');
      return;
    }
    if (!consent) {
      setError('Необходимо согласие на обработку данных.');
      return;
    }

    setLoading(true);
    try {
      const captchaToken = await ensureToken();
      const utm = Object.fromEntries(
        new URLSearchParams(window.location.search)
      );
      const referrer = document.referrer || null;
      const pathname = window.location.pathname;

      await postJson(CONFIG.SUBMIT_LEAD_URL, {
        email,
        position,
        telegram,
        consent,
        captchaToken,
        utm,
        referrer,
        pathname,
      });

      alert('Чек-лист отправлен на ваш email. Проверьте почту!');
      setEmail('');
      setPosition('');
      setTelegram('');
      setConsent(false);
      tokenRef.current = null;
      if (window.turnstile && captchaId.current)
        window.turnstile.reset(captchaId.current);
    } catch (e: any) {
      const code = e?.message;
      const detail = e?.detail;
      let msg = 'Не удалось отправить форму.';
      if (code === 'captcha_timeout' || code === 'captcha_not_ready')
        msg = 'Капча не успела выполниться. Попробуйте ещё раз.';
      if (code === 'timeout') msg = 'Сервер долго не отвечает.';
      if (code === 'resend_error')
        msg =
          'Письмо не отправилось. Напишите нам в Telegram — пришлём вручную.';
      setError(detail ? `${msg} (${detail})` : msg);
      await trackEvent(CONFIG.TRACK_EVENT_URL, {
        type: 'form_error',
        code,
        detail,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1" htmlFor="email">
          Email*
        </label>
        <input
          id="email"
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded bg-anix-dark border border-gray-600 text-white"
        />
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="position">
          Должность*
        </label>
        <input
          id="position"
          value={position}
          required
          onChange={(e) => setPosition(e.target.value)}
          className="w-full px-3 py-2 rounded bg-anix-dark border border-gray-600 text-white"
        />
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="telegram">
          Telegram*
        </label>
        <input
          id="telegram"
          value={telegram}
          required
          onChange={(e) => setTelegram(e.target.value)}
          className="w-full px-3 py-2 rounded bg-anix-dark border border-gray-600 text-white"
        />
      </div>
      <div className="flex items-center">
        <input
          id="consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mr-2"
          required
        />
        <label htmlFor="consent" className="text-sm">
          Я согласен(а) на обработку персональных данных
        </label>
      </div>
      <div ref={captchaRef} aria-hidden="true" />
      <div className="space-y-1">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-anix-purple hover:bg-anix-teal text-white py-2 rounded transition-colors disabled:opacity-50"
        >
          {loading ? 'Отправка...' : '📩 Получить чек-лист в Telegram'}
        </button>
        {error && (
          <div className="mt-2 text-center text-sm text-white" role="status">
            {error}
          </div>
        )}
        <p className="text-sm text-[#B0B0B0] text-center">
          Чек-лист придёт в Telegram, а при желании разберём его вместе с вами.
        </p>
      </div>
    </form>
  );
}
