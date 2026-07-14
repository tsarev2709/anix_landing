const fs = require('fs');
const path = require('path');

const routesPath = path.resolve(__dirname, '../src/seo/routes.json');
const config = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

config.routes['/cases'] = {
  indexable: true,
  kind: 'webPage',
  title: 'Кейсы Anix Studio — анимация для B2B, фармы, кино и охраны труда',
  description:
    'Кейсы Anix Studio: технологии и B2B, Pharma и MedTech, Cinema / Creative, охрана труда и специальные проекты.',
  ogTitle: 'Кейсы Anix Studio — сложные продукты в понятных историях',
  ogDescription:
    'Проекты Anix для технологий, B2B, фармы, MedTech, кино и охраны труда.',
  ogImage: '/og/home.jpg',
  h1: 'Сложные продукты, которые стали понятными историями',
  intro:
    'Кейсы Anix Studio для технологий, B2B, фармы, MedTech, кино и охраны труда. Разные задачи и визуальные языки — один принцип: сначала понять, что должно произойти со зрителем.',
  sections: [
    { heading: 'Технологии, B2B и сложные продукты', body: 'Объясняющие ролики и визуальные истории для продуктов, которые сложно объяснить одним слайдом.' },
    { heading: 'Pharma, MedTech и медицина', body: 'Проекты, где одновременно важны точность, доверие, научная логика и внимание аудитории.' },
    { heading: 'Cinema, Creative и охрана труда', body: 'Кинематографичные эксперименты, исторические миры и визуальные системы для коммуникации правил безопасности.' },
  ],
  links: [
    { label: 'Технологии, B2B и сложные продукты', href: '/cases/b2b' },
    { label: 'Pharma, MedTech и медицина', href: '/cases/medicine' },
    { label: 'Cinema & Creative', href: '/cases/cinema' },
    { label: 'Охрана труда', href: '/cases/hse' },
    { label: 'Anix Studio', href: '/' },
  ],
  breadcrumbs: [
    { label: 'Главная', href: '/' },
    { label: 'Кейсы', href: '/cases' },
  ],
};

const categories = {
  '/cases/b2b': {
    title: 'Кейсы B2B и технологических продуктов — Anix Studio',
    description: 'Кейсы Anix Studio для технологий, B2B и сложных продуктов: объясняющие ролики, визуальные истории и продуктовая коммуникация.',
    h1: 'Технологии, B2B и сложные продукты',
    intro: 'Кейсы для продуктов, которые трудно объяснить одним слайдом: сложная механика, новая категория, длинный цикл продажи или профессиональная аудитория.',
  },
  '/cases/medicine': {
    title: 'Кейсы Pharma, MedTech и медицины — Anix Studio',
    description: 'Кейсы Anix Studio для фармы, MedTech и медицины: медицинская анимация, визуализация сложных продуктов и коммуникация для врачей.',
    h1: 'Pharma, MedTech и медицина',
    intro: 'Проекты, где одновременно важны точность, доверие и внимание: медицинские продукты, препараты, доказательная база, врачи и пациенты.',
  },
  '/cases/cinema': {
    title: 'Cinema & Creative — кейсы Anix Studio',
    description: 'Кинематографичные и креативные кейсы Anix Studio: прототипы сцен, исторические миры и авторские визуальные эксперименты.',
    h1: 'Cinema & Creative',
    intro: 'Кинематографичные прототипы, исторические миры и авторские эксперименты — там, где важны атмосфера, художественный язык и скорость проверки идеи.',
  },
  '/cases/hse': {
    title: 'Кейсы по охране труда и HSE — Anix Studio',
    description: 'Кейсы Anix Studio по охране труда и HSE: маскоты, визуальные системы и коммуникация жизненно важных правил.',
    h1: 'Охрана труда',
    intro: 'Визуальные системы, которые помогают правилам безопасности не растворяться в регламентах и оставаться в поле внимания сотрудников.',
  },
};

for (const [routePath, data] of Object.entries(categories)) {
  config.routes[routePath] = {
    indexable: true,
    kind: 'webPage',
    title: data.title,
    description: data.description,
    ogTitle: data.title,
    ogDescription: data.description,
    ogImage: '/og/home.jpg',
    h1: data.h1,
    intro: data.intro,
    sections: [
      { heading: 'Кейсы направления', body: data.intro },
      { heading: 'Подход Anix', body: 'Сначала разбираемся в задаче и аудитории, затем выбираем драматургию, визуальный язык и производственный формат.' },
    ],
    links: [
      { label: 'Все кейсы Anix Studio', href: '/cases' },
      { label: 'Anix Studio', href: '/' },
    ],
    breadcrumbs: [
      { label: 'Главная', href: '/' },
      { label: 'Кейсы', href: '/cases' },
      { label: data.h1, href: routePath },
    ],
  };
}

fs.writeFileSync(routesPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
console.log('[seo-routes] ensured /cases hub and category routes');
