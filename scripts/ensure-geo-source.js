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
    breadcrumbs: [{ label: 'Главная', href: '/' }, ...(url.startsWith('/knowledge/') ? [{label:'Ответы заказчику',href:'/knowledge'}] : []), {label:page.h1,href:url}],
  };
}
for (const [url, extra] of Object.entries(data.enhancements)) {
  const route = config.routes[url];
  if (!route) throw new Error(`Missing route for GEO enhancement: ${url}`);
  route.geoSections = extra.geoSections || [];
  route.geoFaq = extra.geoFaq || [];
  const links = new Map((route.links || []).map(item => [item.href, item]));
  for (const item of extra.links || []) links.set(item.href, item);
  route.links = [...links.values()];
}
fs.writeFileSync(configPath, `${JSON.stringify(config,null,2)}\n`);
const publicFacts = { name:'Anix Studio', alternateName:['Anix','Студия Аникс'],url:config.baseUrl, reviewedAt:data.reviewedAt, source:`${config.baseUrl}/facts/`, statements:config.routes['/facts'].sections };
fs.writeFileSync(path.resolve(__dirname,'../public/anix-facts.json'), `${JSON.stringify(publicFacts,null,2)}\n`);
console.log(`[geo] prepared ${Object.keys(pages).length} pages and ${Object.keys(data.enhancements).length} contextual updates`);
