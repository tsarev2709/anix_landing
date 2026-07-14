const fs = require('fs');
const path = require('path');

const routesPath = path.resolve(__dirname, '../src/seo/routes.json');
const config = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

config.routes['/cases'] = {
  indexable: true,
  kind: 'webPage',
  title: 'Кейсы Anix Studio — анимация для B2B, фармы, кино и охраны труда',
  description:
    'Кейсы Anix Studio: технологии и B2B, Pharma и MedTech, Cinema & Creative, охрана труда и специальные проекты.',
  ogTitle: 'Кейсы Anix Studio — сложные продукты в понятных историях',
  ogDescription:
    'Проекты Anix для технологий, B2B, фармы, MedTech, кино и охраны труда.',
  ogImage: '/og/home.jpg',
  h1: 'Сложные продукты, которые стали понятными историями',
  intro:
    'Кейсы Anix Studio для технологий, B2B, фармы, MedTech, кино и охраны труда. Разные задачи и визуальные языки — один принцип: сначала понять, что должно произойти со зрителем.',
  sections: [
    {
      heading: 'Технологии, B2B и сложные продукты',
      body: 'Объясняющие ролики и визуальные истории для продуктов, которые сложно объяснить одним слайдом.',
    },
    {
      heading: 'Pharma, MedTech и медицина',
      body: 'Проекты, где одновременно важны точность, доверие, научная логика и внимание аудитории.',
    },
    {
      heading: 'Cinema, Creative и охрана труда',
      body: 'Кинематографичные эксперименты, исторические миры и визуальные системы для коммуникации правил безопасности.',
    },
  ],
  links: [
    { label: 'Технологии, B2B и сложные продукты', href: '/cases#b2b' },
    { label: 'Pharma, MedTech и медицина', href: '/cases#medicine' },
    { label: 'Cinema & Creative', href: '/cases#cinema' },
    { label: 'Охрана труда', href: '/cases#hse' },
    { label: 'Anix Studio', href: '/' },
  ],
  breadcrumbs: [
    { label: 'Главная', href: '/' },
    { label: 'Кейсы', href: '/cases' },
  ],
};

fs.writeFileSync(routesPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
console.log('[seo-routes] ensured /cases hub route');
