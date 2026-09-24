const fs = require('fs');
const path = require('path');
const config = require('../src/seo/routes.json');
const data = require('../src/content/geoContent.json');
const prompts = require('../docs/geo/prompts.json').prompts;
const experiment = require('../docs/geo/experiment-2026-09-14.json');
const failures = [];
const assert = (ok, message) => { if (!ok) failures.push(message); };
const esc = text => text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
assert(prompts.length === 80 && new Set(prompts.map(p=>p.id)).size === 80,'Expected 80 unique prompt IDs');
const sitemap = fs.readFileSync(path.resolve(__dirname,'../build/sitemap.xml'),'utf8');
for (const [url, route] of Object.entries(config.routes).filter(([,r])=>r.geoPage || r.geoSections?.length || r.geoFaq?.length)) {
  const file = path.resolve(__dirname,'../build',url.slice(1),'index.html');
  assert(fs.existsSync(file), `${url}: missing static entry`);
  if (!fs.existsSync(file)) continue;
  const html=fs.readFileSync(file,'utf8');
  assert(sitemap.includes(`<loc>${config.baseUrl}${url}/</loc>`),`${url}: sitemap entry missing`);
  assert(html.includes(`rel="canonical" href="${config.baseUrl}${url}/"`),`${url}: canonical mismatch`);
  assert((html.match(/<h1[ >]/g)||[]).length===1,`${url}: expected one H1`);
  for (const section of [...(route.geoPage?route.sections:[]),...(route.geoSections||[])]) assert(html.includes(esc(section.body)),`${url}: missing visible text: ${section.heading}`);
  for (const item of route.geoFaq||[]) assert(html.includes(esc(item.answer)),`${url}: FAQ not in static HTML`);
  for (const link of route.links||[]) if(link.href.startsWith('/')) assert(fs.existsSync(path.resolve(__dirname,'../build',link.href.slice(1),'index.html')),`${url}: linked route has no static entry ${link.href}`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(match[1]); } catch { failures.push(`${url}: invalid JSON-LD`); } }
}
assert(Object.keys(data.pages).length===18,'Expected HSE article and existing GEO pages');
const articleHtml=fs.readFileSync(path.resolve(__dirname,'../build/knowledge/hse-cost-optimization/index.html'),'utf8');
assert((articleHtml.match(/class="hse-article__figure"/g)||[]).length===7,'HSE article must include seven figures in static HTML');
for (const image of Object.values(require('../src/content/hseSavingsArticle.json').images)) {
  const imagePath=path.resolve(__dirname,'../build',image.src.slice(1));
  assert(fs.existsSync(imagePath) && fs.statSync(imagePath).size>10000,`HSE article image missing or empty: ${image.src}`);
}
assert(articleHtml.includes('450 000 ₽') && articleHtml.includes('Росстат') && articleHtml.includes('Safe-пакет Anix'),'HSE article content missing');
assert(articleHtml.includes('"@type":"Article"'),'HSE Article schema missing');
assert(experiment.prompts.length===12 && new Set(experiment.prompts.map(p=>p.id)).size===12,'Expected 12 unique experimental prompts');
assert(experiment.prompts.every(p=>/России|российские/.test(p.prompt)),'Experimental prompts must specify Russia');
for (const cluster of ['hse','energy','mascots','medicine']) assert(experiment.prompts.filter(p=>p.cluster===cluster).length===3, 'Expected 3 prompts per cluster: '+cluster);
for (const url of ['/hse/energy','/hse/introductory-video','/mascots','/mascots/corporate']) {
  assert(config.routes[url]?.kind==='service',url+': service schema expected');
  const html=fs.readFileSync(path.resolve(__dirname,'../build',url.slice(1),'index.html'),'utf8');
  assert(html.includes(esc(config.routes[url].h1)),url+': H1 copy mismatch');
  assert(html.includes('"@type":"Service"') || html.includes('"@type": "Service"'),url+': missing Service JSON-LD');
}
assert(config.routes['/hse'].h1===data.enhancements['/hse'].hero.h1,'HSE heading must use the shared source');
assert(config.routes['/hse'].intro===data.enhancements['/hse'].hero.intro,'HSE intro must use the shared source');
assert(config.routes['/hse/energy'].breadcrumbs.some(item=>item.href==='/hse'),'Energy page must belong to HSE');
assert(config.routes['/hse/introductory-video'].breadcrumbs.some(item=>item.href==='/hse'),'Introductory HSE page must belong to HSE');
assert(config.routes['/mascots/corporate'].breadcrumbs.some(item=>item.href==='/mascots'),'Corporate mascot page must belong to mascots');
const factsJson = JSON.parse(fs.readFileSync(path.resolve(__dirname,'../build/anix-facts.json'),'utf8'));
assert(factsJson.notClaimed?.some(item=>item.includes('Кейсы для энергетических компаний опубликованы без названий заказчиков')),'Energy confidentiality boundary missing');
const llms = fs.readFileSync(path.resolve(__dirname,'../build/llms.txt'),'utf8');
assert(llms.includes('/hse/introductory-video/'),'llms.txt missing introductory HSE page');
assert(llms.includes('/mascots/corporate/'),'llms.txt missing corporate mascot page');
assert(llms.includes('Кейсы для энергетических компаний опубликованы без названий заказчиков'),'llms.txt missing confidentiality boundary');
assert(!sitemap.includes('/andrey-tsarev/'),'Hidden profile exposed');
assert(!sitemap.includes('/cases/rchk/'),'Removed case exposed');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log('[geo] PASS: 80 archived prompt IDs, 12 experimental prompts, 18 GEO pages, contextual content, llms.txt, evidence boundaries, links, canonical, sitemap, JSON-LD and privacy guards');
