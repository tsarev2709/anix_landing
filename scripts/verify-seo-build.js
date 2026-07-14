const fs = require('fs');
const path = require('path');
const seoConfig = require('../src/seo/routes.json');

const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'build');
const requiredRoutes = ['/', '/medicine', '/hse', '/rybki', '/privacy', '/personal-data'];
const requiredCommercialRoutes = ['/cases', '/animation', '/ai-video'];
const failures = [];

function normalizeBrandText(value = '') {
  return String(value).replaceAll('ANIX', 'Anix');
}

function canonicalUrl(routePath) {
  return routePath === '/' ? `${seoConfig.baseUrl}/` : `${seoConfig.baseUrl}${routePath}/`;
}

function routeFile(routePath) {
  if (routePath === '/') return path.join(buildDir, 'index.html');
  const normalized = routePath.replace(/^\//, '').replace(/\/$/, '');
  return path.join(buildDir, normalized, 'index.html');
}

function readRoute(routePath) {
  const filePath = routeFile(routePath);
  if (!fs.existsSync(filePath)) {
    failures.push(`${routePath}: static HTML file is missing (${path.relative(root, filePath)})`);
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
}

function countMatches(value, regex) {
  return [...value.matchAll(regex)].length;
}

function getContent(html, regex) {
  return html.match(regex)?.[1]?.trim() || '';
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function expectedOgType(route) {
  if (route.kind === 'profile') return 'profile';
  if (route.kind === 'case' || route.kind === 'creativeWork') return 'article';
  return 'website';
}

function verifyRoute(routePath) {
  const route = seoConfig.routes[routePath];
  const html = readRoute(routePath);
  if (!html || !route) return;

  const title = getContent(html, /<title>([\s\S]*?)<\/title>/i);
  const description = getContent(html, /<meta\s+name="description"\s+content="([^"]*)"\s*\/?\s*>/i);
  const robots = getContent(html, /<meta\s+name="robots"\s+content="([^"]*)"\s*\/?\s*>/i);
  const canonical = getContent(html, /<link\s+rel="canonical"\s+href="([^"]*)"\s*\/?\s*>/i);
  const ogUrl = getContent(html, /<meta\s+property="og:url"\s+content="([^"]*)"\s*\/?\s*>/i);
  const ogImage = getContent(html, /<meta\s+property="og:image"\s+content="([^"]*)"\s*\/?\s*>/i);
  const ogType = getContent(html, /<meta\s+property="og:type"\s+content="([^"]*)"\s*\/?\s*>/i);
  const h1Count = countMatches(html, /<h1\b[^>]*>/gi);
  const jsonLdScripts = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  const expectedCanonical = canonicalUrl(routePath);

  assert(title === normalizeBrandText(route.title), `${routePath}: title mismatch`);
  assert(description === normalizeBrandText(route.description), `${routePath}: description mismatch`);
  assert(robots === (route.indexable ? 'index, follow' : 'noindex, follow'), `${routePath}: robots mismatch`);
  assert(canonical === expectedCanonical, `${routePath}: canonical mismatch (${canonical})`);
  assert(ogUrl === expectedCanonical, `${routePath}: og:url mismatch (${ogUrl})`);
  assert(/^https:\/\//.test(ogImage), `${routePath}: og:image must be absolute`);
  assert(ogType === expectedOgType(route), `${routePath}: og:type mismatch (${ogType})`);
  assert(h1Count === 1, `${routePath}: expected exactly one H1 in static HTML, got ${h1Count}`);
  assert(html.includes(normalizeBrandText(route.intro)), `${routePath}: main static text is missing`);
  assert(html.includes('data-seo-shell="true"'), `${routePath}: static SEO shell is missing`);
  assert(!/<meta\s+name="keywords"/i.test(html), `${routePath}: legacy meta keywords found`);
  assert(jsonLdScripts.length > 0, `${routePath}: JSON-LD is missing`);

  for (const script of jsonLdScripts) {
    try {
      JSON.parse(script[1]);
    } catch (error) {
      failures.push(`${routePath}: invalid JSON-LD (${error.message})`);
    }
  }

  const localOgPath = ogImage.replace(`${seoConfig.baseUrl}/`, '');
  assert(fs.existsSync(path.join(buildDir, localOgPath)), `${routePath}: OG image is missing (${localOgPath})`);
}

for (const routePath of requiredRoutes) verifyRoute(routePath);

for (const [routePath, route] of Object.entries(seoConfig.routes)) {
  if (route.indexable && !requiredRoutes.includes(routePath)) verifyRoute(routePath);
}

const sitemapPath = path.join(buildDir, 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'sitemap.xml is missing');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  for (const [routePath, route] of Object.entries(seoConfig.routes)) {
    const absolute = canonicalUrl(routePath);
    if (route.indexable) {
      assert(sitemap.includes(`<loc>${absolute}</loc>`), `sitemap: missing ${absolute}`);
    } else {
      assert(!sitemap.includes(`<loc>${absolute}</loc>`), `sitemap: noindex route included ${absolute}`);
    }
  }
}

const robotsPath = path.join(buildDir, 'robots.txt');
assert(fs.existsSync(robotsPath), 'robots.txt is missing');
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  assert(robots.includes('User-agent: *'), 'robots.txt: User-agent is missing');
  assert(robots.includes('Allow: /'), 'robots.txt: public crawling is not allowed');
  assert(robots.includes(`Sitemap: ${seoConfig.baseUrl}/sitemap.xml`), 'robots.txt: sitemap URL mismatch');
}

const notFoundPath = path.join(buildDir, '404.html');
assert(fs.existsSync(notFoundPath), '404.html is missing');
if (fs.existsSync(notFoundPath)) {
  const notFound = fs.readFileSync(notFoundPath, 'utf8');
  assert(notFound.includes('<title>Страница не найдена — Anix Studio</title>'), '404: unique title is missing');
  assert(notFound.includes('content="noindex, follow"'), '404: noindex is missing');
  assert(!/<link\s+rel="canonical"/i.test(notFound), '404: canonical must not be present');
  assert(countMatches(notFound, /<h1\b[^>]*>/gi) === 1, '404: expected one H1');
}

for (const route of Object.values(seoConfig.routes)) {
  for (const link of route.links || []) {
    if (!link.href.startsWith('/')) continue;
    const clean = link.href.split('#')[0] || '/';
    if (clean === '/') continue;
    const target = routeFile(clean);
    assert(fs.existsSync(target), `internal link target is missing: ${link.href}`);
  }
}

const indexableRoutes = Object.entries(seoConfig.routes).filter(([, route]) => route.indexable);
const titleOwners = new Map();
for (const [routePath, route] of indexableRoutes) {
  const normalizedTitle = normalizeBrandText(route.title).trim();
  assert(normalizedTitle.length > 0, `${routePath}: indexable route title is empty`);
  if (titleOwners.has(normalizedTitle)) {
    failures.push(`${routePath}: duplicate indexable title also used by ${titleOwners.get(normalizedTitle)}`);
  } else {
    titleOwners.set(normalizedTitle, routePath);
  }
}

for (const routePath of requiredCommercialRoutes) {
  const route = seoConfig.routes[routePath];
  assert(Boolean(route), `${routePath}: required commercial route is missing from SEO config`);
  assert(route?.indexable === true, `${routePath}: required commercial route must be indexable`);
  assert(fs.existsSync(routeFile(routePath)), `${routePath}: required commercial static route is missing`);
}

const animationLinks = new Set((seoConfig.routes['/animation']?.links || []).map((link) => link.href));
const aiVideoLinks = new Set((seoConfig.routes['/ai-video']?.links || []).map((link) => link.href));
assert(animationLinks.has('/ai-video'), '/animation: SEO links must include /ai-video');
assert(animationLinks.has('/cases'), '/animation: SEO links must include /cases');
assert(aiVideoLinks.has('/animation'), '/ai-video: SEO links must include /animation');
assert(aiVideoLinks.has('/cases'), '/ai-video: SEO links must include /cases');

for (const [routePath, route] of Object.entries(seoConfig.routes)) {
  if (route.kind !== 'case') continue;
  assert(Boolean(route.case), `${routePath}: case route is missing case data`);
  assert(Boolean(route.case?.relatedPath), `${routePath}: case route is missing relatedPath`);
  if (route.case?.relatedPath) {
    assert(Boolean(seoConfig.routes[route.case.relatedPath]), `${routePath}: relatedPath does not exist (${route.case.relatedPath})`);
  }
  if (route.case?.image?.startsWith('/')) {
    const localImage = path.join(buildDir, route.case.image.replace(/^\//, ''));
    assert(fs.existsSync(localImage), `${routePath}: case image is missing (${route.case.image})`);
  }
}

if (failures.length) {
  console.error('\nSEO build verification failed:');
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}

console.log(`[seo-check] verified ${indexableRoutes.length} indexable routes, ${requiredRoutes.length} required routes, commercial architecture, case data, sitemap, robots and 404`);
