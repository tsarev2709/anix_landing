import React from 'react';
import { CONFIG } from '../config';
import { postJson, trackEvent } from '../lib/net';

export default function LeadForm() {
  const [email, setEmail] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [telegram, setTelegram] = React.useState('');
  const [consent, setConsent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
        utm,
        referrer,
        pathname,
      });

      alert('Чек-лист отправлен на ваш email. Проверьте почту!');
      setEmail('');
      setPosition('');
      setTelegram('');
      setConsent(false);
    } catch (e: any) {
      const code = e?.message;
      const detail = e?.detail;
      let msg = 'Не удалось отправить форму.';
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
