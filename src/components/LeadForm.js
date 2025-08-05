import React, { useState } from 'react';

const LeadForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    role: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.role || !formData.consent) return;

    const data = { ...formData };
    // Mock submission: replace with integration to Supabase, Notion API, etc.
    console.log('Lead form submitted', data);
    // Example placeholder: fetch('/api/lead', { method: 'POST', body: JSON.stringify(data) });

    setSubmitted(true);
    onSuccess && onSuccess();
  };

  if (submitted) {
    return (
      <p className="text-center text-green-400">
        Спасибо! Чек-лист отправлен вам на почту
      </p>
    );
  }

  return (
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
        <label className="block text-sm mb-1" htmlFor="role">
          Должность*
        </label>
        <input
          id="role"
          name="role"
          required
          value={formData.role}
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
      <a
        href="#"
        className="block text-center text-xs text-gray-400 underline mt-2"
      >
        Privacy Policy
      </a>
    </form>
  );
};

export default LeadForm;

