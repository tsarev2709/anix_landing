const fs = require('fs');
const path = require('path');
const classifier = require('../src/content/hseWorkClassifier.json');

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'public', 'data');
const downloadsDir = path.join(root, 'public', 'downloads');
const baseUrl = 'https://studio.anix-ai.pro';

// JSON and CSV are rebuilt deterministically. The multi-sheet XLSX template is
// a reviewed, versioned binary stored in public/downloads alongside them.

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(downloadsDir, { recursive: true });

const dictionaries = Object.fromEntries(
  Object.entries(classifier.dictionaries).map(([key, items]) => [
    key,
    new Map(items.map((item) => [item.code, item.title])),
  ])
);

const titles = (dictionary, codes = []) =>
  codes.map((code) => dictionaries[dictionary].get(code) || code).join(' | ');

const rows = classifier.entries.map((entry) => ({
  Код: entry.work_id,
  Работа: entry.title,
  Синонимы: entry.synonyms.join(' | '),
  Действие: titles('actions', entry.action),
  Оборудование: titles('equipment', entry.equipment),
  Условия: titles('conditions', entry.conditions),
  Опасности: titles('hazards', entry.hazards),
  'Допуск и организация': entry.permits.join(' | '),
  Компетенции: entry.competencies.join(' | '),
  'Обучающие модули': entry.training_modules.join(' | '),
  Источники: entry.sources.join(' | '),
  Применимость: entry.applicability,
  'Дата проверки': entry.reviewed_at,
  Статус: entry.review_status,
}));

const csvEscape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const toCsv = (items) => {
  const headers = Object.keys(items[0]);
  return `\ufeff${headers.map(csvEscape).join(';')}\n${items
    .map((row) => headers.map((header) => csvEscape(row[header])).join(';'))
    .join('\n')}\n`;
};

const publicDataset = {
  '@context': {
    '@vocab': 'https://schema.org/',
    work_id: 'identifier',
    reviewed_at: 'dateModified',
    sources: 'citation',
  },
  '@type': 'Dataset',
  name: classifier.name,
  description: classifier.scope,
  url: `${baseUrl}/hse/work-classifier/`,
  version: classifier.version,
  dateModified: classifier.reviewed_at,
  inLanguage: classifier.language,
  isBasedOn: classifier.sources.map((source) => source.url),
  distribution: [
    {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: `${baseUrl}/data/hse-energy-work-classifier.json`,
    },
    {
      '@type': 'DataDownload',
      encodingFormat: 'text/csv',
      contentUrl: `${baseUrl}/data/hse-energy-work-classifier.csv`,
    },
  ],
  disclaimer: classifier.disclaimer,
  dictionaries: classifier.dictionaries,
  sources: classifier.sources,
  entries: classifier.entries,
};

fs.writeFileSync(
  path.join(dataDir, 'hse-energy-work-classifier.json'),
  `${JSON.stringify(publicDataset, null, 2)}\n`,
  'utf8'
);
fs.writeFileSync(
  path.join(dataDir, 'hse-energy-work-classifier.csv'),
  toCsv(rows),
  'utf8'
);

const templateRows = [
  {
    'Локальный код': 'ЛОК-001',
    'Название работы': 'Пример: ремонт оборудования',
    Синонимы: 'Как работу называют в филиалах',
    'Код действия': 'РБ-РЕМ',
    'Код оборудования': 'ОБ-ТРФ',
    'Коды условий': 'УС-СНЯ | УС-ВЫС',
    'Коды опасностей': 'ОП-ТОК | ОП-ПАД',
    'Документ / пункт': 'Название локального документа и пункт',
    'Допуск / процедура': 'Определяет работодатель',
    Компетенции: 'Требуемые роли, знания и подтверждения',
    Обучение: 'Модуль / тема / формат',
    'Владелец содержания': 'Функция или подразделение',
    'Дата проверки': 'ГГГГ-ММ-ДД',
    Статус: 'черновик / проверено / требует пересмотра',
  },
];

fs.writeFileSync(
  path.join(downloadsDir, 'karta-rabot-povyshennoi-opasnosti-energy.csv'),
  toCsv(templateRows),
  'utf8'
);

console.log(
  `[hse-classifier] generated ${classifier.entries.length} examples, JSON and CSV assets`
);
