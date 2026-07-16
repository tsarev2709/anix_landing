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
  'src/components/SiteFooter.jsx',
  'src/components/CasePage.jsx',
];

const cleanRouteReplacements = [
  ["'/medicine/'", "'/medicine'"],
  ['"/medicine/"', '"/medicine"'],
  ["'/hse/'", "'/hse'"],
  ['"/hse/"', '"/hse"'],
  ["'/ceo/'", "'/ceo'"],
  ['"/ceo/"', '"/ceo"'],
  ["'/why_it_works/'", "'/why_it_works'"],
  ['"/why_it_works/"', '"/why_it_works"'],
  ["'/privacy/'", "'/privacy'"],
  ['"/privacy/"', '"/privacy"'],
  ["'/personal-data/'", "'/personal-data'"],
  ['"/personal-data/"', '"/personal-data"'],
];

const caseLinkReplacements = [
  ["href: 'https://drive.google.com/file/d/1EYWBYlhSgIK4Wd4F0nTKR1kQxYhXGc5j/view'", "href: '/cases/clappy'"],
  ["href: 'https://drive.google.com/file/d/1Q6RQlNbAKBGugpo-MH1-_6omwwnmPQ8E/view'", "href: '/cases/hemotech-ai'"],
  ["href: 'https://drive.google.com/file/d/1BgJs_mKyvEVtDlWeaXGY9rmFjPKrTes5/view'", "href: '/cases/tpes'"],
  ["title: 'Эндаумент-фонд МФТИ',\n    category: 'PR и узнаваемость',\n    result: 'Telegram x2, сайт x3, ERV x10',", "title: 'Эндаумент-фонд МФТИ',\n    category: 'PR и узнаваемость',\n    result: 'Telegram x2, сайт x3, ERV x10',"],
  ["image: mftiCaseImage,\n    href: '#cases',", "image: mftiCaseImage,\n    href: '/cases/mfti-endowment',"],
  ["href: 'https://drive.google.com/file/d/1Uw9e-ZFzg9AVK8NnoN_EHwfR0ZPvD_M0/view'", "href: '/cases/mosfarma'"],
  ["image: multonCaseImage,\n    href: '/hse',", "image: multonCaseImage,\n    href: '/cases/multon-partners',"],
];

const approvedBrandLine = 'Anix Studio (Студия Аникс) — анимационная студия для сложных продуктов.';

for (const relativePath of files) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) continue;

  const current = fs.readFileSync(filePath, 'utf8');
  let next = current
    .replace(/^import\s+\{\s*Helmet\s*\}\s+from\s+['"]react-helmet['"];?\s*\r?\n/m, '')
    .replace(/\s*<Helmet>[\s\S]*?<\/Helmet>\s*/g, '\n')
    .replaceAll('anix.ai@yandex.ru', 'studio@anix-ai.pro')
    .replaceAll('ANIX', 'Anix');

  for (const [from, to] of cleanRouteReplacements) next = next.split(from).join(to);
  if (relativePath.endsWith('Design1TestPage.jsx')) {
    // Keep this technical marker compatible with scripts/build.js. The build script
    // replaces the original showreel <img> with responsive WebP markup and then
    // removes the visualThree import. If this marker is normalized to "Anix" first,
    // the replacement misses and production crashes with visualThree undefined.
    next = next.replace('Постер showreel Anix', 'Постер showreel ANIX');
    next = next.replace(
      'Anix / AI-видео, анимация и сложные продукты',
      approvedBrandLine,
    );
    for (const [from, to] of caseLinkReplacements) next = next.replace(from, to);
  }

  if (next !== current) {
    fs.writeFileSync(filePath, next, 'utf8');
    console.log(`[seo-source] normalized SEO source in ${relativePath}`);
  }
}
