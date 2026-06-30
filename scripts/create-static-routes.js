const fs = require('fs');
const path = require('path');

const buildDir = path.resolve(__dirname, '..', 'build');
const indexFile = path.join(buildDir, 'index.html');
const routes = ['medicine', 'why_it_works'];

if (!fs.existsSync(indexFile)) {
  console.warn('[routes] build/index.html not found, skipping static route copies');
  process.exit(0);
}

for (const route of routes) {
  const routeDir = path.join(buildDir, route);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.copyFileSync(indexFile, path.join(routeDir, 'index.html'));
}

fs.copyFileSync(indexFile, path.join(buildDir, '404.html'));
console.log(`[routes] created static entries for: ${routes.join(', ')}`);
