import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const RESEND_API_KEY = 're_ATrQ5hQa_8i8yxvW2a3U3mwxgNHNzcY2p';

const sendChecklistEmail = async (email) => {
  const htmlContent = `
<h2>🎯 Как explainer-видео помогает продавать B2B-продукты</h2>

<p><b>📄 Ваш чек-лист доступен здесь:</b><br/>
👉 <a href="https://studio.anix-ai.pro/checklist.pdf">Скачать PDF</a></p>

<p><b>🚀 Кейс 1: SaaS-платформа для HR</b><br/>
Видео помогло увеличить конверсии на лендинге с 1,2% до 1,66%<br/>
<strong>Почему:</strong> люди начали лучше понимать ценность — в первые 30 сек.</p>

<p><b>🛠 Кейс 2: промышленное ПО</b><br/>
Видео добавили на главную и в презентации — заявки с сайта удвоились<br/>
<strong>Почему:</strong> менеджеры стали меньше объяснять, больше продавать</p>

<p><a href="https://studio.anix-ai.pro#cases">→ Посмотреть больше кейсов</a></p>

<hr/>

<p>С уважением,<br/>
Команда Anix<br/>
<a href="https://anix-ai.pro">anix-ai.pro</a> | hello@anix-ai.pro</p>`;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'hello@anix-ai.pro',
        to: email,
        subject: 'Ваш чек-лист по explainer-видео + 2 кейса',
        html: htmlContent,
      }),
    });
  } catch (err) {
    console.error('Ошибка отправки email', err);
  }
};

const LeadForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    position: '',
    telegram: '',
    consent: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.position || !formData.consent) return;

    const { email, position, telegram } = formData;
    const { error } = await supabase.from('leads').insert([
      {
        email,
        position,
        telegram,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error(error);
      alert('Ошибка. Попробуйте ещё раз.');
    } else {
      await sendChecklistEmail(email);
      setSubmitted(true);
      onSuccess && onSuccess();
      alert('Спасибо! Чек-лист отправлен вам на почту.');
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
            Telegram
          </label>
          <input
            id="telegram"
            name="telegram"
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
