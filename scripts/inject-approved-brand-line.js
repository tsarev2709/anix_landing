const fs = require('fs');
const path = require('path');

const homePath = path.resolve(__dirname, '..', 'build', 'index.html');
const brandLine = 'Anix Studio (Студия Аникс) — анимационная студия для сложных продуктов.';

if (!fs.existsSync(homePath)) throw new Error('build/index.html not found');

let html = fs.readFileSync(homePath, 'utf8');
if (!html.includes(brandLine)) {
  html = html.replace(
    '<main><h1>',
    `<main><p class="seo-shell-brand">${brandLine}</p><h1>`,
  );
  fs.writeFileSync(homePath, html, 'utf8');
  console.log('[brand-seo] added approved Anix / Студия Аникс line to static home HTML');
}
