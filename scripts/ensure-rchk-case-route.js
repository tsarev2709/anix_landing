const fs = require('fs');
const path = require('path');

const routesPath = path.resolve(__dirname, '../src/seo/routes.json');
const config = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

config.routes['/cases/events'] = {
  indexable: true,
  kind: 'webPage',
  title: 'События и выступления — кейсы Anix Studio',
  description:
    'Кейсы Anix Studio для событий и выступлений: AI-ролики, режиссура, презентации и экранный контент для большой аудитории.',
  ogTitle: 'События и выступления — кейсы Anix Studio',
  ogDescription: 'AI-ролики, режиссура, презентации и экранный контент для событий.',
  ogImage: '/og/home.jpg',
  h1: 'События и выступления',
  intro:
    'Проекты, где сценарий, сцена и экран работают как одно целое: AI-ролики, режиссура выступлений, презентации и контент для событий.',
  sections: [
    {
      heading: 'Кейсы направления',
      body: 'Собираем не набор отдельных материалов, а цельную историю для сцены и экрана.',
    },
    {
      heading: 'Подход Anix',
      body: 'Начинаем с реакции аудитории, затем проектируем драматургию, визуальный язык и производственный пайплайн.',
    },
  ],
  links: [
    { label: 'Все кейсы Anix Studio', href: '/cases' },
    { label: 'Anix Studio', href: '/' },
  ],
  breadcrumbs: [
    { label: 'Главная', href: '/' },
    { label: 'Кейсы', href: '/cases' },
    { label: 'События и выступления', href: '/cases/events' },
  ],
};

config.routes['/cases/rchk'] = {
  indexable: true,
  kind: 'case',
  title: 'Кейс РЧК: AI-ролик и технологическое шоу — Anix Studio',
  description:
    'Как Anix Studio собрала получасовое выступление для РЧК: сценарий, режиссуру, презентации и 5,5-минутный AI-ролик с реальными героями.',
  ogTitle: 'РЧК: AI-ролик и технологическое шоу — Anix Studio',
  ogDescription:
    'Получасовое выступление и 5,5-минутный AI-ролик с девятью героями и восемью сгенерированными мирами.',
  ogImage: '/og/home.jpg',
  h1: 'РЧК: как превратить внутреннее выступление в технологическое шоу',
  intro:
    'Полчаса сценического действия, шесть типов контента и главный герой — 5,5-минутный AI-ролик, ради которого Anix собрала полноценный production киношного уровня.',
  case: {
    category: 'Events / AI production',
    result: 'Вау-эффект подтверждён на тестовых просмотрах',
    tags: 'event / AI-video / режиссура / production',
    image: '/og/home.jpg',
    imageAlt: 'Кейс РЧК — AI-ролик и сопровождение выступления Anix Studio',
    relatedPath: '/cases/events',
  },
  sections: [
    {
      heading: 'Задача',
      body: 'Собрать получасовое выступление для большой внутренней аудитории в контуре столичного департамента и превзойти высокую планку прошлогоднего интерактива.',
    },
    {
      heading: 'Главный ролик',
      body: 'В 5,5-минутном репортаже девять сотрудников РЧК стали героями с суперспособностями, а реальная съёмка соединилась с восемью AI-локациями, motion design и композингом.',
    },
    {
      heading: 'Полное сопровождение',
      body: 'Anix отвечала за сценарий и режиссуру блока, ролик-интервью, презентации спикеров, фоновую анимацию и обновлённую говорящую голову руководителя.',
    },
    {
      heading: 'Production',
      body: 'За месяц команда из семи человек произвела весь комплекс материалов. Чистое производство главного ролика заняло две недели: три версии, пересъёмки и ручная доработка сцен на потолке возможностей нейротехнологий.',
    },
    {
      heading: 'Результат',
      body: 'Главный ролик прошёл тестовые просмотры и получил оценку «очень круто». Выступление ещё впереди; после премьеры кейс дополнится реакцией зала и материалами события.',
    },
  ],
  links: [
    { label: 'Все кейсы Anix', href: '/cases' },
    { label: 'События и выступления', href: '/cases/events' },
    { label: 'Anix Studio', href: '/' },
  ],
  breadcrumbs: [
    { label: 'Главная', href: '/' },
    { label: 'Кейсы', href: '/cases' },
    { label: 'РЧК', href: '/cases/rchk' },
  ],
};

const casesRoute = config.routes['/cases'];
if (casesRoute?.links && !casesRoute.links.some((item) => item.href === '/cases/events')) {
  casesRoute.links.splice(-1, 0, {
    label: 'События и выступления',
    href: '/cases/events',
  });
}

fs.writeFileSync(routesPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
console.log('[rchk-case] ensured /cases/events and /cases/rchk');
