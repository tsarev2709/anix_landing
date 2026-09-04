const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'src', 'index.js');
const routesPath = path.join(root, 'src', 'seo', 'routes.json');
const staticRoutesPath = path.join(root, 'scripts', 'create-static-routes.js');
const seoHeadPath = path.join(root, 'src', 'seo', 'SeoHead.jsx');
const staticSeoPath = path.join(root, 'scripts', 'generate-static-seo.js');

function replaceOnce(content, search, replacement, label) {
  if (content.includes(replacement)) return content;
  if (!content.includes(search)) throw new Error(`[andrey-profile] Cannot find ${label}`);
  return content.replace(search, replacement);
}

function replaceOncePattern(content, pattern, replacement, label) {
  if (content.includes(replacement)) return content;
  if (!pattern.test(content)) throw new Error(`[andrey-profile] Cannot find ${label}`);
  return content.replace(pattern, replacement);
}

async function main() {
  let indexSource = fs.readFileSync(indexPath, 'utf8');
  indexSource = replaceOncePattern(
    indexSource,
    /const CeoPage = lazy\(\(\) => import\('\.\/components\/CeoPage'\)\);/,
    "const CeoPage = lazy(() => import('./components/CeoPage'));\nconst AndreyProfilePage = lazy(() => import('./components/AndreyProfilePage'));",
    'page import anchor',
  );
  if (!indexSource.includes("case '/andrey-tsarev':")) {
    const compactCeoRoute = "    case '/ceo': renderInLayout(<CeoPage />); break;";
    const formattedCeoRoute = "    case '/ceo':\n      renderInLayout(<CeoPage />);\n      break;";
    const compactProfileRoute =
      "    case '/andrey-tsarev': renderInLayout(<AndreyProfilePage />); break;";
    const formattedProfileRoute =
      "    case '/andrey-tsarev':\n      renderInLayout(<AndreyProfilePage />);\n      break;";

    const formattedCeoRoutePattern =
      /    case '\/ceo':\r?\n      renderInLayout\(<CeoPage \/>\);\r?\n      break;/;

    if (indexSource.includes(compactCeoRoute)) {
      indexSource = indexSource.replace(
        compactCeoRoute,
        `${compactCeoRoute}\n${compactProfileRoute}`,
      );
    } else if (formattedCeoRoutePattern.test(indexSource)) {
      indexSource = indexSource.replace(
        formattedCeoRoutePattern,
        `${formattedCeoRoute}\n${formattedProfileRoute}`,
      );
    } else {
      throw new Error('[andrey-profile] Cannot find route anchor');
    }
  }
  fs.writeFileSync(indexPath, indexSource);

  const seo = JSON.parse(fs.readFileSync(routesPath, 'utf8'));
  seo.routes['/andrey-tsarev'] = {
    indexable: false,
    robots: 'noindex, nofollow',
    kind: 'profile',
    title: 'Андрей Царёв — сооснователь и продуктовый директор Anix Studio',
    description: 'Андрей Царёв — предприниматель, сооснователь Anix Studio, режиссёр, сценарист и биофизик. Продукты, творчество, технологии, научная работа и подход к сложным проектам.',
    ogTitle: 'Андрей Царёв — предприниматель на стыке творчества, бизнеса и технологий',
    ogDescription: 'Сооснователь Anix Studio, продуктовый директор, режиссёр, сценарист и биофизик. О сложных проектах, научном мышлении и творческой технологии.',
    ogImage: '/og/andrey.jpg',
    h1: 'Собираю сложные идеи в продукты, истории и работающие системы',
    intro: 'Андрей Царёв — предприниматель, режиссёр, сценарист и биофизик, сооснователь и продуктовый директор Anix Studio.',
    person: {
      name: 'Андрей Царёв',
      jobTitle: 'Сооснователь и продуктовый директор Anix Studio',
      sameAs: ['https://t.me/tsarev2709', 'https://t.me/tsarev_startup', 'https://t.me/tsarev_creative'],
    },
    sections: [
      { heading: 'Бизнес, творчество и технологии', body: 'Андрей соединяет продуктовую стратегию, предпринимательство, режиссуру, сценарную работу, научное мышление и технологический R&D.' },
      { heading: 'Научный и творческий фундамент', body: 'ФБМФ МФТИ, научные публикации по молекулярной биофизике, десятки театральных проектов и семь лет преподавания драматургии.' },
      { heading: 'Anix Studio', body: 'В Anix Андрей отвечает за продуктовые решения, сложные продажи, технологическую рамку, стратегию и творческую планку проектов.' },
    ],
    links: [
      { label: 'Кейсы Anix', href: '/cases' },
      { label: 'Anix Medicine', href: '/medicine' },
      { label: 'CEO Anix — Александра Севостьянова', href: '/ceo' },
    ],
    breadcrumbs: [
      { label: 'Главная', href: '/' },
      { label: 'Андрей Царёв', href: '/andrey-tsarev' },
    ],
  };
  fs.writeFileSync(routesPath, `${JSON.stringify(seo, null, 2)}\n`);

  let staticRoutes = fs.readFileSync(staticRoutesPath, 'utf8');
  staticRoutes = replaceOnce(
    staticRoutes,
    "  'medicine','medicine/price','why_it_works','ceo','hse','hse/price','stoimost','animation','ai-video','rybki','rybki_page',",
    "  'medicine','medicine/price','why_it_works','ceo','andrey-tsarev','hse','hse/price','stoimost','animation','ai-video','rybki','rybki_page',",
    'static route anchor',
  );
  fs.writeFileSync(staticRoutesPath, staticRoutes);

  for (const filePath of [seoHeadPath, staticSeoPath]) {
    let source = fs.readFileSync(filePath, 'utf8');
    source = source.replace(
      "name: 'Александра Севостьянова',\n        jobTitle: 'CEO Anix Studio',",
      "name: route.person?.name || 'Александра Севостьянова',\n        jobTitle: route.person?.jobTitle || 'CEO Anix Studio',\n        ...(route.person?.sameAs ? { sameAs: route.person.sameAs } : {}),",
    );
    source = source.replace(
      "const robots = route.indexable ? 'index, follow' : 'noindex, follow';",
      "const robots = route.robots || (route.indexable ? 'index, follow' : 'noindex, follow');",
    );
    fs.writeFileSync(filePath, source);
  }

  const ogSource = path.join(root, 'src', 'images', 'experts', 'andrey-tsarev-scientist.webp');
  const ogTarget = path.join(root, 'public', 'og', 'andrey.jpg');
  fs.mkdirSync(path.dirname(ogTarget), { recursive: true });
  await sharp(ogSource).resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 88, progressive: true }).toFile(ogTarget);

  console.log('[andrey-profile] direct route is ready and hidden from indexing');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
