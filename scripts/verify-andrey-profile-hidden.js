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

assert(fs.existsSync(profileFile), 'Direct Андрей profile HTML is missing');

if (fs.existsSync(profileFile)) {
  const profileHtml = fs.readFileSync(profileFile, 'utf8');
  assert(
    /<meta\s+name="robots"\s+content="noindex, nofollow"\s*\/?\s*>/i.test(profileHtml),
    'Андрей profile must use noindex, nofollow',
  );
}

if (fs.existsSync(buildDir)) {
  for (const filePath of collectHtmlFiles(buildDir)) {
    if (path.resolve(filePath) === path.resolve(profileFile)) continue;
    const html = fs.readFileSync(filePath, 'utf8');
    if (html.includes(profileReference)) {
      failures.push(`Public profile reference found in ${path.relative(root, filePath)}`);
    }
  }
} else {
  failures.push('build directory is missing');
}

assert(fs.existsSync(sitemapFile), 'sitemap.xml is missing');
if (fs.existsSync(sitemapFile)) {
  const sitemap = fs.readFileSync(sitemapFile, 'utf8');
  assert(!sitemap.includes('andrey-tsarev'), 'Андрей profile must not be included in sitemap.xml');
}

if (failures.length) {
  console.error('\nАндрей profile visibility verification failed:');
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}

console.log('[andrey-hidden] direct page kept; noindex/nofollow, sitemap exclusion and zero inbound HTML links verified');
