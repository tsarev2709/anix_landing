const fs = require('fs');
const path = require('path');
const seoConfig = require('../src/seo/routes.json');
const verification = require('../src/seo/verification.json');

const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'build');
const baseIndexPath = path.join(buildDir, 'index.html');
const baseUrl = seoConfig.baseUrl;
const publicEmail = 'studio@anix-ai.pro';
const brandName = 'Anix Studio';
const brandAlternateNames = ['Студия Аникс', 'Аникс Студия', 'Anix'];
const brandDescription =
  'Anix Studio — анимационная студия для сложных продуктов. Создаёт анимационные и AI-ролики, маскотов и визуальные системы для фармы, MedTech, охраны труда, B2B-продуктов и мероприятий.';
const brandKnowsAbout = [
  'анимационные ролики',
  'AI-видео',
  'объясняющие ролики для B2B',
  'медицинская и фармацевтическая коммуникация',
  'MedTech',
  'визуальное обучение по охране труда',
  'маскоты и визуальные системы',
  'видеоконтент для мероприятий',
];

function normalizeBrandText(value = '') {
  return String(value).replaceAll('ANIX', 'Anix');
}

function normalizePath(value = '/') {
  const withoutQuery = value.split('?')[0].split('#')[0] || '/';
  const withoutHtml = withoutQuery.replace(/\.html$/, '').replace(/\/index$/, '');
  if (!withoutHtml || withoutHtml === '/') return '/';
  return withoutHtml.replace(/\/+$/, '') || '/';
}

function publicPath(value = '/') {
  const normalized = normalizePath(value);
  if (normalized === '/') return '/';
  return `${normalized}/`;
}

function routeFromFile(filePath) {
  const relative = path.relative(buildDir, filePath).replace(/\\/g, '/');
  if (relative === 'index.html') return '/';
  if (relative === '404.html') return '/404';
  if (relative.endsWith('/index.html')) return normalizePath(`/${relative.slice(0, -'/index.html'.length)}`);
  return normalizePath(`/${relative}`);
}

function resolveRoute(pathname) {
  const normalized = normalizePath(pathname);
  if (seoConfig.routes[normalized]) return { path: normalized, ...seoConfig.routes[normalized] };
  if (normalized === '/hse/mvp' || normalized.startsWith('/hse/mvp/')) {
    return { path: normalized, ...seoConfig.technicalDefaults };
  }
  return {
    path: normalized,
    indexable: false,
    kind: 'notFound',
    title: 'Страница не найдена — Anix Studio',
    description: 'Запрошенная страница Anix Studio не найдена.',
    ogTitle: 'Страница не найдена — Anix Studio',
    ogDescription: 'Запрошенная страница не найдена.',
    ogImage: '/og/home.jpg',
    h1: 'Страница не найдена',
    intro: 'Проверьте адрес или вернитесь на главную страницу Anix Studio.',
    sections: [],
    links: [{ label: 'На главную', href: '/' }],
  };
}

function absoluteAssetUrl(value) {
  if (/^https?:\/\//.test(value)) return value;
  if (value === '/') return `${baseUrl}/`;
  return `${baseUrl}${value.startsWith('/') ? value : `/${value}`}`;
}

function absolutePageUrl(value) {
  return absoluteAssetUrl(publicPath(value));
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function organizationSchema() {
  return {
    '@type': 'Organization',
    name: brandName,
    alternateName: brandAlternateNames,
    url: `${baseUrl}/`,
    logo: `${baseUrl}/anix_wand.png`,
    description: brandDescription,
    email: publicEmail,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: publicEmail,
      availableLanguage: ['ru'],
    },
    areaServed: {
      '@type': 'Country',
      name: 'Россия',
    },
    knowsAbout: brandKnowsAbout,
    sameAs: seoConfig.organization.sameAs,
  };
}

function buildSchemas(route) {
  const url = absolutePageUrl(route.path);
  const organization = organizationSchema();
  const schemas = [];

  if (route.kind === 'home') {
    schemas.push({ '@context': 'https://schema.org', ...organization });
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: brandName,
      alternateName: brandAlternateNames,
      url: `${baseUrl}/`,
      inLanguage: 'ru-RU',
      description: normalizeBrandText(route.description),
      publisher: organization,
    });
  } else if (route.kind === 'service') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: normalizeBrandText(route.serviceType),
      description: normalizeBrandText(route.description),
      url,
      provider: organization,
      areaServed: organization.areaServed,
      inLanguage: 'ru-RU',
    });
  } else if (route.kind === 'creativeWork' || route.kind === 'case') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: normalizeBrandText(route.h1),
      headline: normalizeBrandText(route.h1),
      description: normalizeBrandText(route.description),
      url,
      image: absoluteAssetUrl(route.ogImage),
      inLanguage: 'ru-RU',
      creator: organization,
      publisher: organization,
    });
  } else if (route.kind === 'profile') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: normalizeBrandText(route.title),
      description: normalizeBrandText(route.description),
      url,
      inLanguage: 'ru-RU',
      mainEntity: {
        '@type': 'Person',
        name: 'Александра Севостьянова',
        jobTitle: 'CEO Anix Studio',
        worksFor: organization,
      },
    });
  } else if (route.kind === 'webPage' || route.kind === 'legal') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: normalizeBrandText(route.title),
      description: normalizeBrandText(route.description),
      url,
      inLanguage: 'ru-RU',
      publisher: organization,
    });
  }

  if (route.breadcrumbs?.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: route.breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: normalizeBrandText(item.label),
        item: absolutePageUrl(item.href),
      })),
    });
  }

  return schemas;
}

function stripSeoHead(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name=["'](?:description|robots|keywords|twitter:card|twitter:title|twitter:description|twitter:image|google-site-verification|yandex-verification)["'][^>]*\/?\s*>/gi, '')
    .replace(/<meta\s+property=["']og:(?:title|description|url|image|type|site_name|locale)["'][^>]*\/?\s*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*\/?\s*>/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');
}

function buildHead(route) {
  const canonical = absolutePageUrl(route.path);
  const ogImage = absoluteAssetUrl(route.ogImage);
  const robots = route.indexable ? 'index, follow' : 'noindex, follow';
  const title = normalizeBrandText(route.title);
  const description = normalizeBrandText(route.description);
  const ogTitle = normalizeBrandText(route.ogTitle || route.title);
  const ogDescription = normalizeBrandText(route.ogDescription || route.description);
  const schemas = buildSchemas(route)
    .map((schema) => `<script type="application/ld+json">${safeJson(schema)}</script>`)
    .join('');
  const canonicalTag = route.kind === 'notFound' ? '' : `<link rel="canonical" href="${escapeHtml(canonical)}"/>`;
  const verificationTags = [
    verification.google
      ? `<meta name="google-site-verification" content="${escapeHtml(verification.google)}"/>`
      : '',
    verification.yandex
      ? `<meta name="yandex-verification" content="${escapeHtml(verification.yandex)}"/>`
      : '',
  ].join('');

  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}"/>`,
    `<meta name="robots" content="${robots}"/>`,
    verificationTags,
    canonicalTag,
    `<meta property="og:title" content="${escapeHtml(ogTitle)}"/>`,
    `<meta property="og:description" content="${escapeHtml(ogDescription)}"/>`,
    `<meta property="og:url" content="${escapeHtml(canonical)}"/>`,
    `<meta property="og:image" content="${escapeHtml(ogImage)}"/>`,
    `<meta property="og:type" content="${route.kind === 'case' || route.kind === 'creativeWork' ? 'article' : route.kind === 'profile' ? 'profile' : 'website'}"/>`,
    `<meta property="og:site_name" content="${brandName}"/>`,
    '<meta property="og:locale" content="ru_RU"/>',
    '<meta name="twitter:card" content="summary_large_image"/>',
    `<meta name="twitter:title" content="${escapeHtml(ogTitle)}"/>`,
    `<meta name="twitter:description" content="${escapeHtml(ogDescription)}"/>`,
    `<meta name="twitter:image" content="${escapeHtml(ogImage)}"/>`,
    schemas,
    '<style id="seo-shell-style">[data-seo-shell]{min-height:100vh;padding:48px max(5vw,24px);background:#f7f4ef;color:#21162d;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}[data-seo-shell] a{color:inherit}[data-seo-shell] header,[data-seo-shell] main,[data-seo-shell] footer{width:min(1180px,100%);margin:0 auto}[data-seo-shell] nav{display:flex;flex-wrap:wrap;gap:14px;margin:0 0 48px}[data-seo-shell] h1{max-width:980px;margin:0;font-size:clamp(42px,7vw,92px);line-height:.98;letter-spacing:-.045em}[data-seo-shell] .seo-shell-intro{max-width:820px;margin:28px 0 64px;font-size:clamp(18px,2vw,26px);line-height:1.5}[data-seo-shell] section{max-width:900px;padding:32px 0;border-top:1px solid #21162d24}[data-seo-shell] h2{font-size:clamp(28px,4vw,48px);line-height:1.05}[data-seo-shell] p{font-size:18px;line-height:1.6}[data-seo-shell] img{display:block;max-width:100%;height:auto;border-radius:24px}[data-seo-shell] footer{padding-top:48px;border-top:1px solid #21162d24}</style>',
  ].join('');
}

function buildBreadcrumbs(route) {
  if (!route.breadcrumbs?.length) return '';
  const items = route.breadcrumbs
    .map((item, index) => {
      const isLast = index === route.breadcrumbs.length - 1;
      const label = normalizeBrandText(item.label);
      return `<li>${isLast ? `<span aria-current="page">${escapeHtml(label)}</span>` : `<a href="${escapeHtml(publicPath(item.href))}">${escapeHtml(label)}</a>`}</li>`;
    })
    .join('');
  return `<nav aria-label="Хлебные крошки"><ol>${items}</ol></nav>`;
}

function buildShell(route) {
  const sections = (route.sections || [])
    .map(
      (section) =>
        `<section><h2>${escapeHtml(normalizeBrandText(section.heading))}</h2><p>${escapeHtml(normalizeBrandText(section.body))}</p></section>`,
    )
    .join('');
  const links = (route.links || [])
    .map(
      (item) =>
        `<a href="${escapeHtml(publicPath(item.href))}">${escapeHtml(normalizeBrandText(item.label))}</a>`,
    )
    .join('');
  const caseImage = route.case
    ? `<figure><img src="${escapeHtml(route.case.image)}" alt="${escapeHtml(normalizeBrandText(route.case.imageAlt))}" width="1200" height="675"/><figcaption>${escapeHtml(normalizeBrandText(route.case.tags || route.case.category))}</figcaption></figure>`
    : '';

  return `<div data-seo-shell="true"><header><a href="/">${brandName}</a>${buildBreadcrumbs(route)}</header><main><h1>${escapeHtml(normalizeBrandText(route.h1))}</h1><p class="seo-shell-intro">${escapeHtml(normalizeBrandText(route.intro))}</p>${caseImage}${sections}<nav aria-label="Связанные страницы">${links}</nav></main><footer><a href="/privacy/">Политика конфиденциальности</a> · <a href="/personal-data/">Обработка персональных данных</a></footer></div>`;
}

function renderHtml(baseHtml, route) {
  let html = stripSeoHead(baseHtml);
  html = html.replace('</head>', `${buildHead(route)}</head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${buildShell(route)}</div>`);
  return html;
}

function collectHtmlFiles(directory) {
  const output = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...collectHtmlFiles(filePath));
    else if (entry.isFile() && entry.name.endsWith('.html')) output.push(filePath);
  }
  return output;
}

function writeSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = Object.entries(seoConfig.routes)
    .filter(([, route]) => route.indexable)
    .map(([routePath]) => {
      const loc = absolutePageUrl(routePath);
      return `  <url><loc>${escapeHtml(loc)}</loc><lastmod>${lastmod}</lastmod></url>`;
    })
    .join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  fs.writeFileSync(path.join(buildDir, 'sitemap.xml'), sitemap, 'utf8');
  console.log(`[seo] sitemap: ${Object.values(seoConfig.routes).filter((route) => route.indexable).length} indexable routes`);
}

function main() {
  if (!fs.existsSync(baseIndexPath)) throw new Error('build/index.html not found');
  const baseHtml = fs.readFileSync(baseIndexPath, 'utf8');
  const files = collectHtmlFiles(buildDir).filter((filePath) => path.basename(filePath) !== '404.html');

  for (const filePath of files) {
    const routePath = routeFromFile(filePath);
    const route = resolveRoute(routePath);
    fs.writeFileSync(filePath, renderHtml(baseHtml, route), 'utf8');
  }

  const notFound = resolveRoute('/404');
  fs.writeFileSync(path.join(buildDir, '404.html'), renderHtml(baseHtml, notFound), 'utf8');
  writeSitemap();
  console.log(`[seo] rendered static HTML shells for ${files.length} files and a dedicated 404 page`);
}

main();
