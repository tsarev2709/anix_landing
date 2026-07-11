const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = [
  'src/components/Design1TestPage.jsx',
  'src/components/DesignOldPage.jsx',
  'src/components/MedicinePage.jsx',
  'src/components/HsePage.jsx',
  'src/components/WhyItWorksPage.jsx',
  'src/components/CeoPage.jsx',
  'src/components/LegalPage.jsx',
  'src/components/RybkiPage.jsx',
  'src/components/RybkiLayeredPage.jsx',
  'src/features/hseMvp/HseMvpPage.jsx',
  'src/components/BlogCard.js',
];

for (const relativePath of files) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) continue;

  const current = fs.readFileSync(filePath, 'utf8');
  const next = current
    .replace(/^import\s+\{\s*Helmet\s*\}\s+from\s+['"]react-helmet['"];?\s*\r?\n/m, '')
    .replace(/\s*<Helmet>[\s\S]*?<\/Helmet>\s*/g, '\n');

  if (next !== current) {
    fs.writeFileSync(filePath, next, 'utf8');
    console.log(`[seo-source] removed legacy Helmet from ${relativePath}`);
  }
}
