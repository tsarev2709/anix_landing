const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const profilePath = path.join(root, 'src', 'components', 'AndreyProfilePage.jsx');
const profileCssPath = path.join(root, 'src', 'components', 'AndreyProfilePage.css');
const homePath = path.join(root, 'src', 'components', 'Design1TestPage.jsx');
const encodedAssetsDir = path.join(root, 'scripts', 'assets', 'andrey-restored');
const outputAssetsDir = path.join(root, 'src', 'images', 'andrey');

const assets = [
  {
    name: 'andrey-business-school-speaking.avif',
    parts: ['andrey-business-school-speaking.avif.b64.part-00'],
    sha256: '834bee5580da298af817a59522b47089a45c9638a333a75fb41a8ef1f3248c01',
  },
  {
    name: 'andrey-business-school-graduates.avif',
    parts: [
      'andrey-business-school-graduates.avif.b64.part-00',
      'andrey-business-school-graduates.avif.b64.part-01',
    ],
    sha256: '36bec97be1836ea2086f224a510376b8928afaccf1d9e222fe2882ff46b7d8a3',
  },
  {
    name: 'andrey-google-kafka.avif',
    parts: [
      'andrey-google-kafka.avif.b64.part-00',
      'andrey-google-kafka.avif.b64.part-01',
    ],
    sha256: '7375515c8cac338655b4210c582c44f0ad38d31c47169c142e5c28e041887617',
  },
  {
    name: 'andrey-academy-pitch.avif',
    parts: ['andrey-academy-pitch.avif.b64.part-00'],
    sha256: 'af454c013cb3e0592391901fe43261165d2127ee34769a8d477c94ef8fd0e9f6',
  },
];

function replaceRequired(source, pattern, replacement, label) {
  if (typeof pattern === 'string') {
    if (!source.includes(pattern)) throw new Error(`[andrey-discoverability] Cannot find ${label}`);
    return source.replace(pattern, replacement);
  }
  if (!pattern.test(source)) throw new Error(`[andrey-discoverability] Cannot find ${label}`);
  return source.replace(pattern, replacement);
}

function restoreOriginalAssets() {
  fs.mkdirSync(outputAssetsDir, { recursive: true });
  for (const asset of assets) {
    const base64 = asset.parts
      .map((part) => {
        const sourcePath = path.join(encodedAssetsDir, part);
        if (!fs.existsSync(sourcePath)) throw new Error(`[andrey-discoverability] Missing encoded source ${part}`);
        return fs.readFileSync(sourcePath, 'utf8').trim();
      })
      .join('');

    const buffer = Buffer.from(base64, 'base64');
    const digest = crypto.createHash('sha256').update(buffer).digest('hex');
    if (digest !== asset.sha256) {
      throw new Error(`[andrey-discoverability] Checksum mismatch for ${asset.name}: ${digest}`);
    }
    fs.writeFileSync(path.join(outputAssetsDir, asset.name), buffer);
    console.log(`[andrey-discoverability] restored ${asset.name} (${buffer.length} bytes)`);
  }
}

restoreOriginalAssets();

let profile = fs.readFileSync(profilePath, 'utf8');
profile = replaceRequired(
  profile,
  /import theatrePromoPhoto[\s\S]*?import anixTeamPhoto[^;]+;/,
  `import businessSchoolSpeakingPhoto from '../images/andrey/andrey-business-school-speaking.avif';
import businessSchoolGraduatesPhoto from '../images/andrey/andrey-business-school-graduates.avif';
import googleKafkaPhoto from '../images/andrey/andrey-google-kafka.avif';
import academyPitchPhoto from '../images/andrey/andrey-academy-pitch.avif';`,
  'photo import block',
);

profile = replaceRequired(
  profile,
  /const gallery = \[[\s\S]*?\n\];/,
  `const gallery = [
  {
    src: businessSchoolSpeakingPhoto,
    alt: 'Андрей Царёв выступает на дне рождения Бизнес-школы МФТИ',
    label: 'Выступление в Бизнес-школе МФТИ',
    width: 1200,
    height: 800,
  },
  {
    src: businessSchoolGraduatesPhoto,
    alt: 'Выпускники Бизнес-школы МФТИ и СберУниверситета',
    label: 'Выпуск Бизнес-школы МФТИ и СберУниверситета',
    width: 1200,
    height: 800,
  },
  {
    src: googleKafkaPhoto,
    alt: 'Андрей Царёв в Google-центре на фоне Франца Кафки',
    label: 'Google-центр / Франц Кафка',
    width: 1200,
    height: 671,
  },
  {
    src: academyPitchPhoto,
    alt: 'Андрей Царёв презентует нейросеть Anix на питчинге Академии инноваторов',
    label: 'Питчинг Академии инноваторов / Anix',
    width: 1200,
    height: 800,
  },
];`,
  'gallery definition',
);

profile = replaceRequired(
  profile,
  /<div className="andrey-hero-visual"[\s\S]*?<\/div>\n      <\/section>/,
  `<div className="andrey-hero-visual" aria-label="Фотографии Андрея Царёва">
          <figure className="andrey-hero-main">
            <img
              src={businessSchoolSpeakingPhoto}
              alt="Андрей Царёв выступает в Бизнес-школе МФТИ"
              width="1200"
              height="800"
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>Предприниматель, автор, публичный спикер</figcaption>
          </figure>
          <figure className="andrey-hero-side">
            <img
              src={googleKafkaPhoto}
              alt="Андрей Царёв в Google-центре на фоне Франца Кафки"
              width="1200"
              height="671"
              decoding="async"
            />
            <figcaption>Google-центр / Франц Кафка</figcaption>
          </figure>
        </div>
      </section>`,
  'hero visual',
);

profile = replaceRequired(
  profile,
  /<div className="andrey-creative-photo">[\s\S]*?<\/div>\n        <div className="andrey-creative-copy">/,
  `<div className="andrey-creative-photo">
          <img
            src={academyPitchPhoto}
            alt="Андрей Царёв презентует нейросеть Anix на питчинге Академии инноваторов"
            width="1200"
            height="800"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="andrey-creative-copy">`,
  'creative photo',
);

profile = profile.replace(
  '<section className="andrey-section andrey-gallery-section">',
  '<section className="andrey-section andrey-gallery-section" id="gallery">',
);
profile = profile.replace(
  '<img src={photo.src} alt={photo.alt} loading="lazy" />',
  '<img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />',
);
fs.writeFileSync(profilePath, profile);

const photoRepairMarker = '/* ANDREY_PHOTO_GEOMETRY_REPAIR_V2 */';
const photoRepairCss = `

${photoRepairMarker}
/* Original photographs retain their complete composition and natural proportions. */
.andrey-hero-visual {
  grid-template-columns: 1fr;
  align-items: start;
  min-width: 0;
  gap: 28px;
}
.andrey-hero-visual figure,
.andrey-gallery-item {
  overflow: visible;
  min-height: 0;
  padding: 0;
  background: transparent;
  box-shadow: none;
}
.andrey-hero-main,
.andrey-hero-side {
  width: 100%;
  aspect-ratio: auto;
  border: 0;
  border-radius: 0;
  transform: none;
}
.andrey-hero-visual img,
.andrey-creative-photo img,
.andrey-gallery-item img {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: contain;
  object-position: center;
  border-radius: clamp(22px, 2vw, 40px);
  box-shadow: 0 26px 68px rgba(23, 19, 21, .15);
  image-rendering: auto;
}
.andrey-hero-visual figcaption,
.andrey-gallery-item figcaption {
  position: static;
  right: auto;
  bottom: auto;
  left: auto;
  display: flex;
  padding: 12px 5px 0;
  background: transparent;
  color: rgba(23, 19, 21, .68);
  backdrop-filter: none;
}
.andrey-creative-photo {
  overflow: visible;
  aspect-ratio: auto;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
}
.andrey-gallery {
  display: block;
  column-count: 2;
  column-gap: clamp(16px, 2vw, 28px);
}
.andrey-gallery-item,
.andrey-gallery-item-1,
.andrey-gallery-item-2,
.andrey-gallery-item-3,
.andrey-gallery-item-4,
.andrey-gallery-item-5,
.andrey-gallery-item-6,
.andrey-gallery-item-7 {
  display: inline-block;
  width: 100%;
  min-height: 0;
  margin: 0 0 clamp(24px, 3vw, 42px);
  break-inside: avoid;
  grid-column: auto;
  grid-row: auto;
  border-radius: 0;
  background: transparent;
  vertical-align: top;
}
.andrey-gallery-item:hover img { transform: none; }
@media (max-width: 680px) {
  .andrey-gallery { column-count: 1; }
  .andrey-hero-visual { gap: 24px; }
  .andrey-hero-visual img,
  .andrey-creative-photo img,
  .andrey-gallery-item img { border-radius: 22px; }
}
`;
let profileCss = fs.readFileSync(profileCssPath, 'utf8');
if (!profileCss.includes(photoRepairMarker)) profileCss += photoRepairCss;
fs.writeFileSync(profileCssPath, profileCss);

let home = fs.readFileSync(homePath, 'utf8');
if (!home.includes("{ label: 'Андрей', href: '/andrey-tsarev' }")) {
  home = replaceRequired(
    home,
    "  { label: 'CEO', href: '/ceo' },\n  { label: 'Процесс', href: '#process' },",
    "  { label: 'CEO', href: '/ceo' },\n  { label: 'Андрей', href: '/andrey-tsarev' },\n  { label: 'Процесс', href: '#process' },",
    'homepage navigation',
  );
}
fs.writeFileSync(homePath, home);

console.log('[andrey-discoverability] verified original photos and natural geometry are ready');
