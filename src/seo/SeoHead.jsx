import React from 'react';
import { Helmet } from 'react-helmet';
import seoConfig from './routes.json';

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
    title: 'Страница не найдена — ANIX Studio',
    description: 'Запрошенная страница ANIX Studio не найдена.',
    ogTitle: 'Страница не найдена — ANIX Studio',
    ogDescription: 'Запрошенная страница не найдена.',
    ogImage: '/og/home.jpg',
    h1: 'Страница не найдена',
    intro: 'Проверьте адрес или вернитесь на главную страницу ANIX Studio.',
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

export const buildStructuredData = (route) => {
  const url = absolutePageUrl(route.path);
  const organization = {
    '@type': 'Organization',
    name: seoConfig.organization.name,
    url: seoConfig.organization.url,
    logo: `${seoConfig.baseUrl}/anix_wand.png`,
    sameAs: seoConfig.organization.sameAs,
  };
  const schemas = [];

  if (route.kind === 'home') {
    schemas.push({ '@context': 'https://schema.org', ...organization });
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: seoConfig.siteName,
      url: `${seoConfig.baseUrl}/`,
      inLanguage: 'ru-RU',
      description: route.description,
      publisher: organization,
    });
  } else if (route.kind === 'service') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: route.serviceType,
      description: route.description,
      url,
      provider: organization,
      inLanguage: 'ru-RU',
    });
  } else if (route.kind === 'creativeWork' || route.kind === 'case') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: route.h1,
      headline: route.h1,
      description: route.description,
      url,
      image: absoluteAssetUrl(route.ogImage),
      inLanguage: 'ru-RU',
      publisher: organization,
    });
  } else if (route.kind === 'profile') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: route.title,
      description: route.description,
      url,
      inLanguage: 'ru-RU',
      mainEntity: {
        '@type': 'Person',
        name: 'Александра Севостьянова',
        jobTitle: 'CEO ANIX Studio',
        worksFor: organization,
      },
    });
  } else if (route.kind === 'webPage' || route.kind === 'legal') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: route.title,
      description: route.description,
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
        name: item.label,
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

  return (
    <Helmet>
      <html lang="ru" />
      <title>{route.title}</title>
      <meta name="description" content={route.description} />
      <meta name="robots" content={robots} />
      {route.kind === 'notFound' ? null : <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={route.ogTitle || route.title} />
      <meta property="og:description" content={route.ogDescription || route.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogTypeForRoute(route)} />
      <meta property="og:site_name" content={seoConfig.siteName} />
      <meta property="og:locale" content="ru_RU" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={route.ogTitle || route.title} />
      <meta name="twitter:description" content={route.ogDescription || route.description} />
      <meta name="twitter:image" content={ogImage} />
      {schemas.map((schema, index) => (
        <script type="application/ld+json" key={`${route.path}-${index}`}>
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
