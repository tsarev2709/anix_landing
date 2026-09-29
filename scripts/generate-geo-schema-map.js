const fs = require('fs');
const path = require('path');
const seoConfig = require('../src/seo/routes.json');
const { buildGeoSchemas } = require('../src/content/geoSchema.cjs');

const map = {};
for (const [routePath, route] of Object.entries(seoConfig.routes)) {
  const schemas = buildGeoSchemas({ path: routePath, ...route }, seoConfig.baseUrl);
  if (schemas.length) map[routePath] = schemas;
}

const outputPath = path.join(__dirname, '../src/content/geoSchemas.json');
fs.writeFileSync(outputPath, `${JSON.stringify(map, null, 2)}\n`, 'utf8');
console.log(`[geo] prepared structured data for ${Object.keys(map).length} routes`);
