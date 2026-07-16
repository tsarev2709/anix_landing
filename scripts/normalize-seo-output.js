const fs = require('fs');
const path = require('path');
const seoConfig = require('../src/seo/routes.json');

const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'build');
const baseUrl = seoConfig.baseUrl;

function canonicalUrl(routePath) {
  return routePath === '/' ? `${baseUrl}/` : `${baseUrl}${routePath}/`;
}

function routeFile(routePath) {
  if (routePath === '/') return path.join(buildDir, 'index.html');
  return path.join(buildDir, routePath.slice(1), 'index.html');
}

function ogType(route) {
  if (route.kind === 'profile') return 'profile';
  if (route.kind === 'case' || route.kind === 'creativeWork') return 'article';
  return 'website';
}

function replaceAbsolutePageUrl(html, routePath) {
  if (routePath === '/') return html;
  const oldUrl = `${baseUrl}${routePath}`;
  const nextUrl = canonicalUrl(routePath);

  return html
    .replaceAll(`href=\"${oldUrl}\"`, `href=\"${nextUrl}\"`)
    .replaceAll(`content=\"${oldUrl}\"`, `content=\"${nextUrl}\"`)
    .replaceAll(`\"url\":\"${oldUrl}\"`, `\"url\":\"${nextUrl}\"`)
    .replaceAll(`\"item\":\"${oldUrl}\"`, `\"item\":\"${nextUrl}\"`);
}

function normalizeRelativeLinks(html) {
  let next = html;
  const publicRoutes = Object.keys(seoConfig.routes).filter((routePath) => routePath !== '/');

  for (const routePath of publicRoutes) {
    next = next.replaceAll(`href=\"${routePath}\"`, `href=\"${routePath}/\"`);
  }

  return next;
}

for (const [routePath, route] of Object.entries(seoConfig.routes)) {
  const filePath = routeFile(routePath);
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, 'utf8');
  for (const knownRoute of Object.keys(seoConfig.routes)) {
    html = replaceAbsolutePageUrl(html, knownRoute);
  }
  html = normalizeRelativeLinks(html);
  html = html.replace(
    /<meta\s+property=\"og:type\"\s+content=\"[^\"]*\"\s*\/?\s*>/i,
    `<meta property=\"og:type\" content=\"${ogType(route)}\"/>`
  );
  fs.writeFileSync(filePath, html, 'utf8');
}

const sitemapPath = path.join(buildDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  for (const [routePath, route] of Object.entries(seoConfig.routes)) {
    if (!route.indexable || routePath === '/') continue;
    sitemap = sitemap.replace(
      `<loc>${baseUrl}${routePath}</loc>`,
      `<loc>${canonicalUrl(routePath)}</loc>`
    );
  }
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
}

console.log('[seo] normalized canonical URLs, internal links and Open Graph types for GitHub Pages');
