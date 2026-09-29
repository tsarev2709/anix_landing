const hseWorkClassifier = require('./hseWorkClassifier.json');

// Shared by the static generator and the client to avoid divergent metadata.
function buildGeoSchemas(route, baseUrl) {
  if (route.path === '/hse/work-classifier') {
    const url = `${baseUrl}${route.path}/`;
    const dictionaryNames = {
      actions: 'Виды работ в энергетике',
      equipment: 'Оборудование энергетического предприятия',
      conditions: 'Условия выполнения работ',
      hazards: 'Опасности при выполнении работ',
    };
    const termSets = Object.entries(hseWorkClassifier.dictionaries).map(
      ([key, items]) => {
        const setId = `${url}#${key}`;
        return {
          '@context': 'https://schema.org',
          '@type': 'DefinedTermSet',
          '@id': setId,
          name: dictionaryNames[key],
          url: setId,
          inLanguage: 'ru-RU',
          hasDefinedTerm: items.map((item) => ({
            '@type': 'DefinedTerm',
            '@id': `${setId}-${encodeURIComponent(item.code)}`,
            name: item.title,
            termCode: item.code,
            inDefinedTermSet: { '@id': setId },
          })),
        };
      }
    );
    const dataset = {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      '@id': `${url}#dataset`,
      name: hseWorkClassifier.name,
      description: hseWorkClassifier.scope,
      url,
      inLanguage: 'ru-RU',
      version: hseWorkClassifier.version,
      dateModified: hseWorkClassifier.reviewed_at,
      creator: {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Anix Studio',
      },
      isBasedOn: hseWorkClassifier.sources.map((source) => source.url),
      variableMeasured: [
        'работа',
        'оборудование',
        'условия',
        'опасности',
        'допуск',
        'компетенции',
        'обучение',
      ],
      distribution: [
        {
          '@type': 'DataDownload',
          encodingFormat: 'application/json',
          contentUrl: `${baseUrl}/data/hse-energy-work-classifier.json`,
        },
        {
          '@type': 'DataDownload',
          encodingFormat: 'text/csv',
          contentUrl: `${baseUrl}/data/hse-energy-work-classifier.csv`,
        },
        {
          '@type': 'DataDownload',
          encodingFormat:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          contentUrl: `${baseUrl}/downloads/karta-rabot-povyshennoi-opasnosti-energy.xlsx`,
          name: 'Шаблон карты работ повышенной опасности',
        },
      ],
      includedInDataCatalog: {
        '@type': 'DataCatalog',
        name: 'Открытые материалы Anix по охране труда',
        url: `${baseUrl}/knowledge/`,
      },
    };
    return [dataset, ...termSets];
  }
  if (!route.geoPage || !route.path.startsWith('/knowledge/')) return [];
  const url = `${baseUrl}${route.path}/`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: route.h1,
      description: route.intro,
      url,
      mainEntityOfPage: url,
      inLanguage: 'ru-RU',
      dateModified: route.reviewedAt,
      author: {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Anix Studio',
      },
      publisher: {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Anix Studio',
      },
      articleSection: 'Материалы для заказчика',
    },
  ];
}
exports.buildGeoSchemas = buildGeoSchemas;
