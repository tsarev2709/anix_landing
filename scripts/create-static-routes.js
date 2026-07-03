const fs = require('fs');
const path = require('path');

const buildDir = path.resolve(__dirname, '..', 'build');
const indexFile = path.join(buildDir, 'index.html');
const routes = [
  'medicine',
  'why_it_works',
  'hse',
  'hse/mvp',
  'hse/mvp/employee',
  'hse/mvp/course/life-saving-rules',
  'hse/mvp/course/life-saving-rules/test',
  'hse/mvp/course/slips-and-falls',
  'hse/mvp/course/slips-and-falls/test',
  'hse/mvp/course/electrical-safety',
  'hse/mvp/course/electrical-safety/test',
  'hse/mvp/specialist',
  'hse/mvp/admin',
  'hse/mvp/request-course',
  'hse/mvp/integrations',
  'hse/mvp/support',
  'design1test',
];

if (!fs.existsSync(indexFile)) {
  console.warn(
    '[routes] build/index.html not found, skipping static route copies'
  );
  process.exit(0);
}

for (const route of routes) {
  const routeDir = path.join(buildDir, route);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.copyFileSync(indexFile, path.join(routeDir, 'index.html'));
  fs.copyFileSync(indexFile, path.join(buildDir, `${route}.html`));
}

fs.copyFileSync(indexFile, path.join(buildDir, '404.html'));
console.log(`[routes] created static entries for: ${routes.join(', ')}`);
