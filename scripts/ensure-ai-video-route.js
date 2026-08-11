const fs = require('fs');
const path = require('path');

const routesPath = path.resolve(__dirname, '../src/seo/routes.json');
const config = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

config.routes['/ai-video'] = {
  indexable: true,
  kind: 'service',
  serviceType: 'AI-видео и генеративный видеопродакшн',
  title: 'AI-видео для бизнеса и сложных визуальных задач — Anix Studio',
  description:
    'Anix Studio профессионально использует AI внутри полноценного анимационного продакшна: сценарий, режиссура, арт-дирекшен, генеративное видео, анимация и постпродакшн.',
  ogTitle: 'AI-видео с режиссурой и полноценным продакшном — Anix Studio',
  ogDescription:
    'Не AI ради AI: генеративное видео как часть режиссёрского, анимационного и постпродакшн-пайплайна.',
  ogImage: '/og/home.jpg',
  h1: 'AI-видео с режиссурой, продакшном и вкусом',
  intro:
    'Anix — полноценная анимационная студия, которая профессионально использует AI внутри продакшна и соединяет генеративные инструменты со сценарием, арт-дирекшеном, анимацией и постпродакшном.',
  sections: [
    {
      heading: 'Что AI действительно даёт',
      body: 'Помогает показывать невозможные миры и будущие продукты, быстрее проверять визуальные идеи и собирать гибридные производственные пайплайны.',
    },
    {
      heading: 'Не AI ради AI',
      body: 'Если задачу надёжнее решить съёмкой, 3D или классической анимацией, используем подходящий инструмент. AI не заменяет режиссуру и художественные решения.',
    },
    {
      heading: 'Контроль качества',
      body: 'Работаем с консистентностью персонажей и продукта, монтажом, композингом, ручной доработкой и другими этапами, которые превращают генерации в законченный ролик.',
    },
  ],
  links: [
    { label: 'Анимационные ролики', href: '/animation' },
    { label: 'Все кейсы Anix Studio', href: '/cases' },
    { label: 'Маленький принц', href: '/cases/little-prince' },
    { label: 'Бородино', href: '/cases/borodino' },
    { label: 'Cinema & Creative', href: '/cases/cinema' },
    { label: 'Anix Studio', href: '/' },
  ],
  breadcrumbs: [
    { label: 'Главная', href: '/' },
    { label: 'AI-видео', href: '/ai-video' },
  ],
};

fs.writeFileSync(routesPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
console.log('[seo-routes] ensured /ai-video route');
