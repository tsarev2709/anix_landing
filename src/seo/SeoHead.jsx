import React from 'react';
import { Helmet } from 'react-helmet';
import seoConfig from './routes.json';
import verification from './verification.json';

const PUBLIC_EMAIL = 'studio@anix-ai.pro';
const BRAND_NAME = 'Anix Studio';
const BRAND_ALTERNATE_NAMES = ['Студия Аникс', 'Аникс Студия', 'Anix'];
const BRAND_DESCRIPTION =
  'Anix Studio — анимационная студия для сложных продуктов. Создаёт анимационные и AI-ролики, маскотов и визуальные системы для фармы, MedTech, охраны труда, B2B-продуктов и мероприятий.';
const BRAND_KNOWS_ABOUT = [
  'анимационные ролики',
  'AI-видео',
  'объясняющие ролики для B2B',
  'медицинская и фармацевтическая коммуникация',
  'MedTech',
  'визуальное обучение по охране труда',
  'маскоты и визуальные системы',
  'видеоконтент для мероприятий',
];

const normalizeBrandText = (value = '') => String(value).replaceAll('ANIX', 'Anix');

const normalizePath = (value = '/') => {
  const withoutQuery = value.split('?')[0].split('#')[0] || '/';
  const withoutIndex = withoutQuery.replace(/index\.html$/, '');
  if (!withoutIndex || withoutIndex === '/') return '/';
  return withoutIndex.replace(/\/+$/, '') || '/';
};

export const resolveSeoRoute = (path) => {
  const normalizedPath = normalizePath(path);
  if (seoConfig.routes[normalizedPath]) {
    return { path: normalizedPath, ...seoConfig.routes[normalizedPath] };
  }
  if (normalizedPath === '/hse/mvp' || normalizedPath.startsWith('/hse/mvp/')) {
    return { path: normalizedPath, ...seoConfig.technicalDefaults };
  }
  return {
    path: normalizedPath,
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
};

const absoluteAssetUrl = (value) => {
  if (/^https?:\/\//.test(value)) return value;
  if (value === '/') return `${seoConfig.baseUrl}/`;
  return `${seoConfig.baseUrl}${value.startsWith('/') ? value : `/${value}`}`;
};

export const toPublicHref = (value = '/') => {
  if (!value.startsWith('/') || value.startsWith('//')) return value;
  const [pathname, suffix = ''] = value.split(/(?=[?#])/u, 2);
  const normalized = normalizePath(pathname);
  const isKnownPage = Boolean(seoConfig.routes[normalized]) || normalized.startsWith('/hse/mvp');

  if (!isKnownPage || normalized === '/') return value;
  return `${normalized}/${suffix}`;
};

const absolutePageUrl = (path) => {
  const href = toPublicHref(path);
  return absoluteAssetUrl(href);
};

const ogTypeForRoute = (route) => {
  if (route.kind === 'profile') return 'profile';
  if (route.kind === 'case' || route.kind === 'creativeWork') return 'article';
  return 'website';
};

const organizationSchema = {
  '@type': 'Organization',
  name: BRAND_NAME,
  alternateName: BRAND_ALTERNATE_NAMES,
  url: `${seoConfig.baseUrl}/`,
  logo: `${seoConfig.baseUrl}/anix_wand.png`,
  description: BRAND_DESCRIPTION,
  email: PUBLIC_EMAIL,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: PUBLIC_EMAIL,
    availableLanguage: ['ru'],
  },
  areaServed: {
    '@type': 'Country',
    name: 'Россия',
  },
  knowsAbout: BRAND_KNOWS_ABOUT,
  sameAs: seoConfig.organization.sameAs,
};

export const buildStructuredData = (route) => {
  const url = absolutePageUrl(route.path);
  const schemas = [];

  if (route.kind === 'home') {
    schemas.push({ '@context': 'https://schema.org', ...organizationSchema });
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: BRAND_NAME,
      alternateName: BRAND_ALTERNATE_NAMES,
      url: `${seoConfig.baseUrl}/`,
      inLanguage: 'ru-RU',
      description: normalizeBrandText(route.description),
      publisher: organizationSchema,
    });
  } else if (route.kind === 'service') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: normalizeBrandText(route.serviceType),
      description: normalizeBrandText(route.description),
      url,
      provider: organizationSchema,
      areaServed: organizationSchema.areaServed,
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
      creator: organizationSchema,
      publisher: organizationSchema,
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
        worksFor: organizationSchema,
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
      publisher: organizationSchema,
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
};

export default function SeoHead({ path = window.location.pathname }) {
  const route = resolveSeoRoute(path);
  const canonical = absolutePageUrl(route.path);
  const ogImage = absoluteAssetUrl(route.ogImage);
  const robots = route.indexable ? 'index, follow' : 'noindex, follow';
  const schemas = buildStructuredData(route);
  const title = normalizeBrandText(route.title);
  const description = normalizeBrandText(route.description);
  const ogTitle = normalizeBrandText(route.ogTitle || route.title);
  const ogDescription = normalizeBrandText(route.ogDescription || route.description);

  return (
    <Helmet>
      <html lang="ru" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {verification.google ? <meta name="google-site-verification" content={verification.google} /> : null}
      {verification.yandex ? <meta name="yandex-verification" content={verification.yandex} /> : null}
      {route.kind === 'notFound' ? null : <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogTypeForRoute(route)} />
      <meta property="og:site_name" content={BRAND_NAME} />
      <meta property="og:locale" content="ru_RU" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
      {schemas.map((schema, index) => (
        <script type="application/ld+json" key={`${route.path}-${index}`}>
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
