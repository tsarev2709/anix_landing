const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'build');
const profileFile = path.join(buildDir, 'andrey-tsarev', 'index.html');
const sitemapFile = path.join(buildDir, 'sitemap.xml');
const profileReference = '/andrey-tsarev';
const failures = [];

function collectHtmlFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collectHtmlFiles(filePath));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(filePath);
  }
  return files;
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

assert(fs.existsSync(profileFile), 'Public Андрей profile HTML is missing');

if (fs.existsSync(profileFile)) {
  const profileHtml = fs.readFileSync(profileFile, 'utf8');
  assert(
    /<meta\s+name="robots"\s+content="index, follow"\s*\/?\s*>/i.test(profileHtml),
    'Андрей profile must use index, follow',
  );
  assert(
    profileHtml.includes('https://studio.anix-ai.pro/andrey-tsarev/'),
    'Андрей profile canonical URL is missing',
  );
}

let inboundReferences = 0;
if (fs.existsSync(buildDir)) {
  for (const filePath of collectHtmlFiles(buildDir)) {
    if (path.resolve(filePath) === path.resolve(profileFile)) continue;
    const html = fs.readFileSync(filePath, 'utf8');
    if (html.includes(profileReference)) inboundReferences += 1;
  }
} else {
  failures.push('build directory is missing');
}
assert(inboundReferences > 0, 'Андрей profile must have at least one inbound public HTML link');

assert(fs.existsSync(sitemapFile), 'sitemap.xml is missing');
if (fs.existsSync(sitemapFile)) {
  const sitemap = fs.readFileSync(sitemapFile, 'utf8');
  assert(
    sitemap.includes('<loc>https://studio.anix-ai.pro/andrey-tsarev/</loc>'),
    'Андрей profile must be included in sitemap.xml',
  );
}

if (failures.length) {
  console.error('\nАндрей profile public visibility verification failed:');
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}

console.log('[andrey-public] index/follow, sitemap inclusion and inbound public links verified');
