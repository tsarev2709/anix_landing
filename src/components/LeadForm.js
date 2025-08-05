import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

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
    const { error } = await supabase
      .from('leads')
      .insert([{ email, position, telegram }]);

    if (error) {
      console.error(error);
      alert('Ошибка. Попробуйте ещё раз.');
    } else {
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
        <button
          type="submit"
          className="w-full bg-anix-purple hover:bg-anix-teal text-white py-2 rounded transition-colors"
        >
          Получить чек-лист
        </button>
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
