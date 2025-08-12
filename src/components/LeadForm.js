import React, { useState, useEffect } from 'react';

const telegramPattern =
  /^(@?[a-zA-Z0-9_]{5,32}|https?:\/\/t\.me\/[a-zA-Z0-9_]{5,32}|tg:\/\/resolve\?domain=[a-zA-Z0-9_]{5,32})$/;

const track = async (event, payload = {}) => {
  const url = process.env.NEXT_PUBLIC_TRACK_EVENT_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, ...payload }),
    });
  } catch (err) {
    console.error('track error', err);
  }
};

const LeadForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    position: '',
    telegram: '',
    consent: false,
    captchaToken: '',
  });
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const utm = window.location.search;
    const referrer = document.referrer;
    const pathname = window.location.pathname;
    track('form_view', { meta: { utm, referrer, pathname } });
  }, []);

  const onFirstInput = () => {
    if (!started) {
      track('form_start');
      setStarted(true);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFirstInput();
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, position, telegram, consent, captchaToken } = formData;
    if (!email || !position || !telegramPattern.test(telegram) || !consent) {
      alert('Проверьте форму');
      return;
    }
    try {
      const utm = window.location.search;
      const referrer = document.referrer;
      const pathname = window.location.pathname;
      const res = await fetch(process.env.NEXT_PUBLIC_SUBMIT_LEAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          position,
          telegram,
          consent,
          captchaToken,
          utm,
          referrer,
          pathname,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка');
      track('form_submit', { leadId: data.leadId });
      setSubmitted(true);
      alert('Спасибо! Чек-лист отправлен вам на почту.');
    } catch (err) {
      alert(err.message);
    }
  };

  if (submitted) {
    return (
      <p className="text-center text-green-400">
        Спасибо! Чек-лист отправлен вам на почту.
      </p>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          data-callback={(token) =>
            setFormData((p) => ({ ...p, captchaToken: token }))
          }
        />
        <div className="space-y-1">
          <button
            type="submit"
            className="w-full bg-anix-purple hover:bg-anix-teal text-white py-2 rounded transition-colors"
          >
            📩 Получить чек-лист в Telegram
          </button>
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
