const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const routeScript = path.join(__dirname, 'ensure-andrey-profile-route.js');
const routesPath = path.join(root, 'src', 'seo', 'routes.json');
const seoHeadPath = path.join(root, 'src', 'seo', 'SeoHead.jsx');
const staticSeoPath = path.join(root, 'scripts', 'generate-static-seo.js');
const srcPath = path.join(root, 'src');
const profilePath = '/andrey-tsarev';

const run = spawnSync(process.execPath, [routeScript], { stdio: 'inherit' });
if (run.status !== 0) process.exit(run.status || 1);

const seo = JSON.parse(fs.readFileSync(routesPath, 'utf8'));
if (!seo.routes[profilePath]) throw new Error('[andrey-profile-hidden] Route config was not generated');
seo.routes[profilePath].indexable = false;
seo.routes[profilePath].follow = false;
fs.writeFileSync(routesPath, `${JSON.stringify(seo, null, 2)}\n`);

for (const filePath of [seoHeadPath, staticSeoPath]) {
  let source = fs.readFileSync(filePath, 'utf8');
  source = source.replace(
    "const robots = route.indexable ? 'index, follow' : 'noindex, follow';",
    "const robots = route.indexable ? 'index, follow' : route.follow === false ? 'noindex, nofollow' : 'noindex, follow';",
  );
  fs.writeFileSync(filePath, source);
}

const allowedReferences = new Set([
  path.join(srcPath, 'index.js'),
  path.join(srcPath, 'seo', 'routes.json'),
  path.join(srcPath, 'components', 'AndreyProfilePage.jsx'),
]);

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    else if (/\.(?:js|jsx|ts|tsx|json|html)$/u.test(entry.name)) files.push(absolute);
  }
  return files;
}

const forbidden = walk(srcPath).filter((filePath) => {
  if (allowedReferences.has(filePath)) return false;
  return fs.readFileSync(filePath, 'utf8').includes(profilePath);
});

if (forbidden.length) {
  throw new Error(
    `[andrey-profile-hidden] Incoming profile links remain in:\n${forbidden
      .map((filePath) => `- ${path.relative(root, filePath)}`)
      .join('\n')}`,
  );
}

console.log('[andrey-profile-hidden] no incoming site links; robots=noindex,nofollow; direct URL preserved');
