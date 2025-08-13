import React, { useEffect, useState } from 'react';
import { CONFIG, assertConfig } from '@/config';
import { track } from '../lib/analytics';

function withTimeout<T>(p: Promise<T>, ms = 15000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  return Promise.race([
    p.finally(() => clearTimeout(t)),
    new Promise<T>((_, rej) =>
      ac.signal.addEventListener('abort', () => rej(new Error('timeout')))
    ),
  ]) as Promise<T>;
}

async function submitLead(payload: any) {
  if (!CONFIG.SUBMIT_LEAD_URL || CONFIG.SUBMIT_LEAD_URL.includes('undefined')) {
    throw new Error('misconfigured');
  }
  try {
    const res = await withTimeout(
      fetch(CONFIG.SUBMIT_LEAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data?.error || data?.message || `HTTP ${res.status}`;
      const err: any = new Error(String(msg));
      err.code = res.status;
      throw err;
    }
    return data;
  } catch (e: any) {
    if (e?.name === 'AbortError' || e?.message === 'timeout')
      throw new Error('network_timeout');
    if (e?.message === 'Failed to fetch') throw new Error('network_failed');
    throw e;
  }
}

const telegramPattern =
  /^(@?[a-zA-Z0-9_]{5,32}|https?:\/\/t\.me\/[a-zA-Z0-9_]{5,32}|tg:\/\/resolve\?domain=[a-zA-Z0-9_]{5,32})$/;

const LeadForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    position: '',
    telegram: '',
    consent: false,
    captchaToken: '',
  });
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    assertConfig();
    const utm = window.location.search;
    const referrer = document.referrer;
    const pathname = window.location.pathname;
    track('form_view', { utm, referrer, pathname });
  }, []);

  const onFirstInput = () => {
    if (!started) {
      track('form_start');
      setStarted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onFirstInput();
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorText(null);
    setSubmitting(true);
    const { email, position, telegram, consent, captchaToken } = formData;
    if (!captchaToken) {
      setErrorText('Подтвердите, что вы не бот (капча).');
      track('form_error', { kind: 'captcha', raw: 'missing_token' });
      setSubmitting(false);
      return;
    }
    if (!telegramPattern.test(telegram)) {
      setErrorText('Некорректный Telegram.');
      track('form_error', { kind: 'telegram', raw: telegram });
      setSubmitting(false);
      return;
    }
    const utm = window.location.search;
    const referrer = document.referrer;
    const pathname = window.location.pathname;
    const payload = {
      email,
      position,
      telegram,
      consent,
      captchaToken,
      utm,
      referrer,
      pathname,
    };
    try {
      const data = await submitLead(payload);
      track('form_submit', { leadId: data?.leadId });
      setSubmitted(true);
      // here could clear form if needed
    } catch (err: any) {
      let msg = 'Не удалось отправить. Попробуйте обновить страницу.';
      let kind: string = 'server';
      if (err?.message === 'misconfigured') {
        msg = 'Неверная конфигурация формы (URL).';
        kind = 'config';
      } else if (err?.message === 'network_timeout') {
        msg = 'Сервер долго не отвечает. Попробуйте ещё раз.';
        kind = 'network_timeout';
      } else if (err?.message === 'network_failed') {
        msg = 'Сеть недоступна или CORS. Проверьте подключение.';
        kind = 'network_failed';
      } else if (err?.code === 400 && /captcha/i.test(err?.message)) {
        msg = 'Не прошла проверка капчи. Обновите страницу.';
        kind = 'captcha';
      }
      setErrorText(msg);
      track('form_error', { kind, raw: String(err?.message || err) });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <p className="text-center text-green-400">
        Спасибо! Чек-лист отправлен вам на почту.
      </p>
    );
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="email">
            Email*
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-anix-dark border border-gray-600 text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="position">
            Должность*
          </label>
          <input
            id="position"
            name="position"
            required
            value={formData.position}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-anix-dark border border-gray-600 text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="telegram">
            Telegram*
          </label>
          <input
            id="telegram"
            name="telegram"
            required
            pattern={telegramPattern.source}
            value={formData.telegram}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-anix-dark border border-gray-600 text-white"
          />
        </div>
        <div className="flex items-center">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            checked={formData.consent}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="consent" className="text-sm">
            Я согласен(а) на обработку персональных данных
          </label>
        </div>
        <div
          className="cf-turnstile"
          data-sitekey={CONFIG.TURNSTILE_SITE_KEY}
          data-callback={(token: string) =>
            setFormData((p) => ({ ...p, captchaToken: token }))
          }
        />
        <div className="space-y-1">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-anix-purple hover:bg-anix-teal text-white py-2 rounded transition-colors disabled:opacity-50"
          >
            {submitting ? 'Отправка...' : '📩 Получить чек-лист в Telegram'}
          </button>
          {errorText && (
            <div className="mt-2 text-center text-sm text-white" role="status">
              {errorText}
            </div>
          )}
          <p className="text-sm text-[#B0B0B0] text-center">
            Чек-лист придёт в Telegram, а при желании разберём его вместе с
            вами.
          </p>
        </div>
      </form>
      <a
        href="#"
        className="block text-center text-xs text-gray-400 underline mt-2"
      >
        Политика конфиденциальности
      </a>
    </>
  );
};

export default LeadForm;
