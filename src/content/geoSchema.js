// Shared by the static generator and the client to avoid divergent metadata.
function buildGeoSchemas(route, baseUrl) {
  if (!route.geoPage || !route.path.startsWith('/knowledge/')) return [];
  const url = `${baseUrl}${route.path}/`;
  return [{
    '@context':'https://schema.org', '@type':'Article', '@id':`${url}#article`,
    headline:route.h1, description:route.intro, url,
    mainEntityOfPage:url, inLanguage:'ru-RU', dateModified:route.reviewedAt,
    author:{'@type':'Organization','@id':`${baseUrl}/#organization`,name:'Anix Studio'},
    publisher:{'@type':'Organization','@id':`${baseUrl}/#organization`,name:'Anix Studio'},
    articleSection:'Материалы для заказчика',
  }];
}
module.exports = { buildGeoSchemas };
