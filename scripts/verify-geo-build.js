const fs = require('fs');
const path = require('path');
const config = require('../src/seo/routes.json');
const data = require('../src/content/geoContent.json');
const prompts = require('../docs/geo/prompts.json').prompts;
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
assert(Object.keys(data.pages).length===12,'Expected ten guides plus two standalone pages');
assert(!sitemap.includes('/andrey-tsarev/'),'Hidden profile exposed');
assert(!sitemap.includes('/cases/rchk/'),'Removed case exposed');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log('[geo] PASS: 80 prompt IDs, 13 pages, contextual content, links, canonical, sitemap, JSON-LD and privacy guards');
