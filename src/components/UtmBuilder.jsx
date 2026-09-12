import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { buildMarketingUrl, UTM_PRESETS } from '../lib/utmBuilder';
import './UtmBuilder.css';
const labels = {
  utm_source: 'Source',
  utm_medium: 'Medium',
  utm_campaign: 'Campaign',
  utm_content: 'Content',
  utm_term: 'Term',
  anix_segment: 'Segment',
  anix_offer: 'Offer',
  anix_audience: 'Audience',
  anix_asset: 'Asset',
  anix_owner: 'Owner',
};
export default function UtmBuilder() {
  const [base, setBase] = useState('https://studio.anix-ai.pro/');
  const [fields, setFields] = useState({
    utm_source: 'telegram',
    utm_medium: 'organic',
  });
  const [message, setMessage] = useState('');
  let url = '',
    error = '';
  try {
    url = buildMarketingUrl(base, fields);
  } catch (e) {
    error = e.message;
  }
  return (
    <main className="utm-builder">
      <Helmet>
        <title>UTM builder — Anix</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <p>Anix · Внутренний инструмент</p>
      <h1>Ссылка с понятным источником</h1>
      <p>
        Используйте латиницу, строчные буквы и подчёркивания. Не добавляйте имя
        клиента, email, телефон или Telegram.
      </p>
      <label>
        Страница сайта
        <input
          type="url"
          value={base}
          onChange={(e) => {
            setBase(e.target.value);
            setMessage('');
          }}
        />
      </label>
      <div className="utm-presets">
        {Object.entries(UTM_PRESETS).map(([name, [source, medium]]) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              setFields((f) => ({
                ...f,
                utm_source: source,
                utm_medium: medium,
              }));
              setMessage('');
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="utm-fields">
        {Object.entries(labels).map(([key, label]) => (
          <label key={key}>
            {label}
            {['utm_source', 'utm_medium', 'utm_campaign'].includes(key)
              ? ' *'
              : ''}
            <input
              name={key}
              value={fields[key] || ''}
              maxLength={120}
              placeholder={
                key === 'utm_campaign' ? 'hse_onboarding_2026q3' : ''
              }
              onChange={(e) => {
                setFields((f) => ({ ...f, [key]: e.target.value }));
                setMessage('');
              }}
            />
          </label>
        ))}
      </div>
      <label>
        Готовая ссылка
        <textarea
          aria-label="Готовая ссылка"
          readOnly
          value={url}
          rows={4}
          onFocus={(e) => e.target.select()}
        />
      </label>
      <p role="status">{message || error || 'Ссылка готова.'}</p>
      <button
        type="button"
        disabled={!url}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setMessage('Ссылка скопирована');
          } catch {
            setMessage('Выделите ссылку выше и скопируйте вручную.');
          }
        }}
      >
        Скопировать ссылку
      </button>
    </main>
  );
}
