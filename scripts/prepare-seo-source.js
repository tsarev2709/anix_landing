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

const originalShowreelFunction = `function VideoShowreel({ variant = 'hero' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={\`d1-showreel d1-showreel-\${variant}\`}>
      <div className="d1-showreel-frame">
        {isOpen ? (
          <iframe
            src={showreelUrl}
            width="1280"
            height="720"
            title="Anix showreel"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
            frameBorder="0"
            allowFullScreen
          />
        ) : (
          <button
            className="d1-showreel-poster"
            type="button"
            onClick={() => setIsOpen(true)}
          >`;

const geoShowreelFunction = `function VideoShowreel({ variant = 'hero' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [provider, setProvider] = useState(null);
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    let active = true;
    resolveShowreelProvider().then((resolvedProvider) => {
      if (active) setProvider(resolvedProvider);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleOpen = async () => {
    setIsResolving(true);
    try {
      const resolvedProvider = provider || (await resolveShowreelProvider());
      setProvider(resolvedProvider);
      setIsOpen(true);
    } finally {
      setIsResolving(false);
    }
  };

  const activeProvider = provider || getFallbackShowreelProvider();

  return (
    <div className={\`d1-showreel d1-showreel-\${variant}\`}>
      <div className="d1-showreel-frame">
        {isOpen ? (
          <>
            <iframe
              src={SHOWREEL_URLS[activeProvider]}
              width="1280"
              height="720"
              title={\`Anix showreel — \${activeProvider === 'vk' ? 'VK Video' : 'YouTube'}\`}
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
              frameBorder="0"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
            {activeProvider === 'youtube' ? (
              <a
                className="d1-showreel-external"
                href={SHOWREEL_EXTERNAL_URLS.youtube}
                target="_blank"
                rel="noreferrer"
              >
                Открыть на YouTube
              </a>
            ) : null}
          </>
        ) : (
          <button
            className="d1-showreel-poster"
            type="button"
            onClick={handleOpen}
            disabled={isResolving}
          >`;

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
    next = next.replace('Постер showreel Anix', 'Постер showreel ANIX');
    next = next.replace(
      'Anix / AI-видео, анимация и сложные продукты',
      approvedBrandLine,
    );
    for (const [from, to] of caseLinkReplacements) next = next.replace(from, to);

    next = next
      .replace("import React, { useState } from 'react';", "import React, { useEffect, useState } from 'react';")
      .replace(
        "import SiteFooter from './SiteFooter';",
        "import SiteFooter from './SiteFooter';\nimport { getFallbackShowreelProvider, resolveShowreelProvider, SHOWREEL_EXTERNAL_URLS, SHOWREEL_URLS } from '../utils/showreelProvider';",
      )
      .replace(
        /const showreelUrl =\s*\n\s*'https:\/\/vkvideo\.ru\/video_ext\.php\?[^']+';\s*\n/,
        '',
      )
      .replace(originalShowreelFunction, geoShowreelFunction)
      .replace(
        '<span className="d1-showreel-label">Смотреть showreel</span>',
        '<span className="d1-showreel-label">{isResolving ? \'Подбираем видеоплеер…\' : \'Смотреть showreel\'}</span>',
      );
  }

  if (next !== current) {
    fs.writeFileSync(filePath, next, 'utf8');
    console.log(`[seo-source] normalized SEO source in ${relativePath}`);
  }
}
