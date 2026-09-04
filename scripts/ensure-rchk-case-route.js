const fs = require('fs');
const path = require('path');

const routesPath = path.resolve(__dirname, '../src/seo/routes.json');
const config = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

// The case remains archived in source, but must not be published or indexed.
delete config.routes['/cases/rchk'];
delete config.routes['/cases/events'];

const casesRoute = config.routes['/cases'];
if (casesRoute?.links) {
  casesRoute.links = casesRoute.links.filter(
    (item) =>
      item.href !== '/cases/rchk' && item.href !== '/cases/events'
  );
}

fs.writeFileSync(routesPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
console.log('[rchk-case] kept unpublished and removed from public SEO routes');
