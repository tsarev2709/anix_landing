const fs = require('fs');
const path = require('path');

const routesPath = path.resolve(__dirname, '../src/seo/routes.json');
const config = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

config.routes['/animation'] = {
  indexable: true,
  kind: 'service',
  serviceType: 'Создание анимационных роликов',
  title: 'Создание анимационных роликов для сложных продуктов — Anix Studio',
  description:
    'Anix Studio создаёт анимационные ролики для B2B, технологий, фармы, MedTech, обучения и специальных проектов: от сценария и визуального языка до готового ролика.',
  ogTitle: 'Анимационные ролики для сложных продуктов — Anix Studio',
  ogDescription:
    'Объясняющие ролики, продуктовая анимация, научная визуализация, маскоты и mixed media — с режиссурой, драматургией и профессиональным использованием AI.',
  ogImage: '/og/home.jpg',
  h1: 'Создание анимационных роликов для сложных продуктов',
  intro:
    'Придумываем и производим анимационные ролики для технологий, фармы, B2B, образования и специальных проектов — там, где недостаточно просто красиво показать продукт.',
  sections: [
    {
      heading: 'Объяснить сложное',
      body: 'Помогаем показать механику продукта, процесс, технологию или идею, которые трудно объяснить одним слайдом или обычной съёмкой.',
    },
    {
      heading: 'Форма под задачу',
      body: 'Используем объясняющую и продуктовую анимацию, научную визуализацию, персонажей, mixed media, 3D и AI как части одного производственного набора.',
    },
    {
      heading: 'От ролика до визуальной системы',
      body: 'При необходимости развиваем один ролик в серию, маскота, набор адаптаций, презентационные материалы и другие форматы.',
    },
  ],
  links: [
    { label: 'Все кейсы Anix Studio', href: '/cases' },
    { label: 'Маленький принц', href: '/cases/little-prince' },
    { label: 'Мосфарма', href: '/cases/mosfarma' },
    { label: 'Авиандр', href: '/cases/aviandr' },
    { label: 'Мултон Партнерс', href: '/cases/multon-partners' },
    { label: 'Anix Studio', href: '/' },
  ],
  breadcrumbs: [
    { label: 'Главная', href: '/' },
    { label: 'Анимационные ролики', href: '/animation' },
  ],
};

fs.writeFileSync(routesPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
console.log('[seo-routes] ensured /animation route');
