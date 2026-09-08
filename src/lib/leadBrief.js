export const briefFields = [
  {
    name: 'direction',
    label: 'Направление',
    options: [
      'Фарма / медицинская анимация',
      'Охрана труда / HSE',
      'MedTech',
      'B2B / другая задача',
    ],
  },
  {
    name: 'placement',
    label: 'Где будет использоваться материал',
    options: [
      'Конференция / стенд',
      'Сайт / лендинг',
      'Встречи / письма / медпреды',
      'LMS / внутренний портал / QR',
      'Соцсети / рекламная кампания',
      'Несколько каналов',
    ],
  },
  {
    name: 'deadline',
    label: 'Когда нужен результат',
    options: [
      'В течение недели',
      'Через 2–4 недели',
      'Через 1–2 месяца',
      'Позже / планируем заранее',
    ],
  },
  {
    name: 'budget',
    label: 'Бюджетный диапазон',
    options: [
      'До 350 тыс. ₽',
      '350–700 тыс. ₽',
      '700 тыс. – 1,5 млн ₽',
      'От 1,5 млн ₽',
      'Обновления от 150 тыс. ₽ / месяц',
    ],
  },
  {
    name: 'resultType',
    label: 'Тип результата',
    options: [
      'Пилот / один сценарий',
      'Мастер-ролик и адаптации',
      'Серия / 5–7 HSE-модулей',
      'Кампания / система материалов',
      'Обновление библиотеки',
    ],
  },
];

export function inferBriefDirection(path = '') {
  if (/^\/medicine(?:\/|$)/.test(path)) return briefFields[0].options[0];
  if (/^\/hse(?:\/|$)/.test(path)) return briefFields[0].options[1];
  return '';
}

// Use the existing, persisted message field: all brief answers reach both the
// database and the AmoCRM note without a new backend/schema dependency.
export function formatBriefMessage(values) {
  const answers = briefFields.map(
    ({ name, label, options }) =>
      `${label}: ${options.includes(values[name]) ? values[name] : 'Пока не определились'}`
  );
  return `${String(values.message || '')
    .trim()
    .slice(0, 3000)}\n\nПараметры проекта\n${answers.join('\n')}`;
}
