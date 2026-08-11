const fs = require('fs');
const path = require('path');

const buildDir = path.resolve(__dirname, '..', 'build');
const requiredPages = ['index.html', 'medicine/index.html', 'hse/index.html'];
const requiredBrandLine = 'Anix Studio (Студия Аникс) — анимационная студия для сложных продуктов.';
const errors = [];

for (const relativePath of requiredPages) {
  const filePath = path.join(buildDir, relativePath);
  if (!fs.existsSync(filePath)) {
    errors.push(`${relativePath}: missing generated HTML`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  if (/\bANIX\b/.test(html)) errors.push(`${relativePath}: uppercase ANIX remains in public HTML`);
  if (!html.includes('studio@anix-ai.pro')) errors.push(`${relativePath}: corporate email missing`);
}

const homePath = path.join(buildDir, 'index.html');
if (fs.existsSync(homePath)) {
  const home = fs.readFileSync(homePath, 'utf8');
  if (!home.includes(requiredBrandLine)) errors.push('index.html: approved Russian brand line missing');
  for (const requiredValue of [
    '"alternateName":["Студия Аникс","Аникс Студия","Anix"]',
    '"contactPoint"',
    '"knowsAbout"',
    '"areaServed"',
  ]) {
    if (!home.includes(requiredValue)) errors.push(`index.html: Organization schema missing ${requiredValue}`);
  }
}

if (errors.length) {
  console.error('[brand-seo] verification failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('[brand-seo] brand naming, corporate email and Organization entity checks passed');
