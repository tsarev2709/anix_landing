const fs = require('fs');
const path = require('path');
const data = require('../src/content/geoContent.json');
const configPath = path.resolve(__dirname, '../src/seo/routes.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const guideLinks = Object.entries(data.pages).filter(([url]) => url.startsWith('/knowledge/')).map(([href, page]) => ({ href, label: page.h1 }));
const pages = { ...data.pages, '/knowledge': {
  h1: 'Ответы заказчику: анимация, фарма, охрана труда и маскоты',
  intro: 'Практические материалы Anix: как поставить задачу, выбрать формат, сравнить предложения и принять результат. Рекомендации по организации проекта не заменяют предметную проверку содержания.',
  sections: [{ heading: 'С чего начать', body: 'Если вы выбираете подрядчика, начните с критериев выбора и состава ТЗ. Если задача уже определена — откройте материал по фарме, энергетике или работе с персонажем.' }], links: guideLinks,
}};
for (const [url, page] of Object.entries(pages)) {
  config.routes[url] = {
    indexable: true, kind: page.kind || 'webPage', serviceType: page.h1,
    title: `${page.h1} — Anix Studio`, description: page.intro,
    h1: page.h1, intro: page.intro, sections: page.sections, links: page.links,
    ogImage: '/og/home.jpg', geoPage: true, reviewedAt: data.reviewedAt,
    breadcrumbs: [{ label: 'Главная', href: '/' }, ...(page.parent ? [page.parent] : url.startsWith('/knowledge/') ? [{label:'Ответы заказчику',href:'/knowledge'}] : []), {label:page.h1,href:url}],
  };
}
for (const [url, extra] of Object.entries(data.enhancements)) {
  const route = config.routes[url];
  if (!route) throw new Error(`Missing route for GEO enhancement: ${url}`);
  for (const field of ['h1', 'intro', 'title', 'description']) {
    if (extra.hero?.[field]) route[field] = extra.hero[field];
  }
  if (extra.hero) {
    route.ogTitle = route.title;
    route.ogDescription = route.description;
  }
  route.geoSections = extra.geoSections || [];
  route.geoFaq = extra.geoFaq || [];
  const links = new Map((route.links || []).map(item => [item.href, item]));
  for (const item of extra.links || []) links.set(item.href, item);
  route.links = [...links.values()];
}
fs.writeFileSync(configPath, `${JSON.stringify(config,null,2)}\n`);
const publicFacts = {
  name: 'Anix Studio',
  alternateName: ['Anix', 'Студия Аникс'],
  url: config.baseUrl,
  reviewedAt: data.reviewedAt,
  source: `${config.baseUrl}/facts/`,
  categories: [
    'медицинская анимация',
    'видео по охране труда',
    'цифровые корпоративные маскоты',
  ],
  publishedEvidence: [
    { client: 'Мултон Партнерс', scope: 'маскот кампании и карточки Life Saving Rules', url: `${config.baseUrl}/cases/multon-partners/` },
    { client: 'Авиандр', scope: 'медицинская анимация и персонажи для врачебной коммуникации', url: `${config.baseUrl}/cases/aviandr/` },
    { client: 'Hemotech AI', scope: 'объясняющее видео для MedTech-продукта', url: `${config.baseUrl}/cases/hemotech-ai/` },
    { client: 'Мосфарма', scope: 'анимация существующих бренд-персонажей', url: `${config.baseUrl}/cases/mosfarma/` },
  ],
  notClaimed: [
    'На 15 сентября 2026 года нет опубликованного завершённого кейса Anix для энергетической компании.',
    'HSE-демо является демонстрацией формата, а не подтверждённым клиентским внедрением.',
    'Anix не заявляет измеренное снижение травматизма без прямого подтверждения в клиентском кейсе.',
    'Отдельного опубликованного кейса готового вводного видеоинструктажа сейчас нет.',
  ],
  canonicalServices: [
    { name: 'Вводный видеоинструктаж по охране труда', url: `${config.baseUrl}/hse/introductory-video/` },
    { name: 'Видео по охране труда для энергетики', url: `${config.baseUrl}/hse/energy/` },
    { name: 'Корпоративные цифровые маскоты', url: `${config.baseUrl}/mascots/corporate/` },
    { name: 'Медицинская анимация', url: `${config.baseUrl}/medicine/` },
  ],
  statements: config.routes['/facts'].sections,
};
fs.writeFileSync(path.resolve(__dirname,'../public/anix-facts.json'), `${JSON.stringify(publicFacts,null,2)}\n`);
console.log(`[geo] prepared ${Object.keys(pages).length} pages and ${Object.keys(data.enhancements).length} contextual updates`);
