const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const profilePath = path.join(root, 'src', 'components', 'AndreyProfilePage.jsx');
const profileCssPath = path.join(root, 'src', 'components', 'AndreyProfilePage.css');
const homePath = path.join(root, 'src', 'components', 'Design1TestPage.jsx');

function replaceOnce(content, search, replacement, label) {
  if (content.includes(replacement)) return content;
  if (!content.includes(search)) throw new Error(`[andrey-discoverability] Cannot find ${label}`);
  return content.replace(search, replacement);
}

let profile = fs.readFileSync(profilePath, 'utf8');
profile = replaceOnce(
  profile,
  "import theatreGroupPhoto from '../images/andrey/andrey-tochka-theatre.webp';",
  "import theatreGroupPhoto from '../images/andrey/andrey-tochka-theatre.webp';\nimport businessSchoolSpeakingPhoto from '../images/andrey/andrey-business-school-speaking.webp';\nimport googleKafkaPhoto from '../images/andrey/andrey-google-kafka.webp';",
  'profile photo imports',
);
profile = replaceOnce(
  profile,
  "  { src: theatreGroupPhoto, alt: 'Команда студенческого театра «Точка» МФТИ после спектакля', label: 'Театр «Точка»' },\n];",
  "  { src: theatreGroupPhoto, alt: 'Команда студенческого театра «Точка» МФТИ после спектакля', label: 'Театр «Точка»', width: 1200, height: 800 },\n  { src: businessSchoolSpeakingPhoto, alt: 'Андрей Царёв выступает на дне рождения Бизнес-школы МФТИ', label: 'Выступление в Бизнес-школе МФТИ', width: 2048, height: 1365 },\n  { src: googleKafkaPhoto, alt: 'Андрей Царёв в Google-центре на фоне Франца Кафки', label: 'Google-центр / Франц Кафка', width: 1712, height: 958 },\n];",
  'profile gallery',
);
profile = replaceOnce(
  profile,
  "  { src: theatrePromoPhoto, alt: 'Андрей Царёв на фотосессии спектакля «Разбитые каменные сердца Чёрного Города»', label: 'Промо спектакля, 2021' },",
  "  { src: theatrePromoPhoto, alt: 'Андрей Царёв на фотосессии спектакля «Разбитые каменные сердца Чёрного Города»', label: 'Промо спектакля, 2021', width: 1405, height: 937 },",
  'theatre photo dimensions',
);
profile = replaceOnce(
  profile,
  "  { src: portraitPhoto, alt: 'Портрет Андрея Царёва', label: 'Портрет' },",
  "  { src: portraitPhoto, alt: 'Портрет Андрея Царёва', label: 'Портрет', width: 2048, height: 1365 },",
  'portrait dimensions',
);
profile = replaceOnce(
  profile,
  '<img src={portraitPhoto} alt="Портрет Андрея Царёва" fetchPriority="high" />',
  '<img src={portraitPhoto} alt="Портрет Андрея Царёва" width="2048" height="1365" fetchPriority="high" decoding="async" />',
  'hero portrait dimensions',
);
profile = replaceOnce(
  profile,
  '<img src={theatrePromoPhoto} alt="Андрей Царёв в промо спектакля" />',
  '<img src={theatrePromoPhoto} alt="Андрей Царёв в промо спектакля" width="1405" height="937" decoding="async" />',
  'hero theatre dimensions',
);
profile = replaceOnce(
  profile,
  '<img src={theatreGroupPhoto} alt="Команда театра «Точка» МФТИ" loading="lazy" />',
  '<img src={theatreGroupPhoto} alt="Команда театра «Точка» МФТИ" width="1200" height="800" loading="lazy" decoding="async" />',
  'creative photo dimensions',
);
profile = replaceOnce(
  profile,
  '<section className="andrey-section andrey-gallery-section">',
  '<section className="andrey-section andrey-gallery-section" id="gallery">',
  'gallery anchor',
);
profile = replaceOnce(
  profile,
  '<img src={photo.src} alt={photo.alt} loading="lazy" />',
  '<img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />',
  'gallery image dimensions',
);
fs.writeFileSync(profilePath, profile);

const photoRepairMarker = '/* ANDREY_PHOTO_GEOMETRY_REPAIR */';
const photoRepairCss = `

${photoRepairMarker}
/* Preserve the source composition: no forced aspect ratios, stretching or cover crops. */
.andrey-hero-visual {
  grid-template-columns: 1fr;
  align-items: stretch;
  min-width: 0;
}
.andrey-hero-visual figure {
  width: 100%;
  padding: 0;
}
.andrey-hero-main,
.andrey-hero-side {
  aspect-ratio: auto;
  transform: none;
}
.andrey-hero-side {
  width: 78%;
  justify-self: end;
}
.andrey-hero-visual img,
.andrey-creative-photo img,
.andrey-gallery-item img {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: contain;
  object-position: 50% 50%;
  image-rendering: auto;
}
.andrey-creative-photo {
  aspect-ratio: auto;
  padding: 0;
}
.andrey-gallery {
  display: block;
  column-count: 3;
  column-gap: 16px;
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
  margin: 0 0 16px;
  break-inside: avoid;
  grid-column: auto;
  grid-row: auto;
  vertical-align: top;
}
.andrey-gallery-item:hover img {
  transform: none;
}
@media (max-width: 1180px) {
  .andrey-hero-side { width: 72%; }
}
@media (max-width: 900px) {
  .andrey-gallery { column-count: 2; }
}
@media (max-width: 680px) {
  .andrey-hero-side { width: 100%; }
  .andrey-gallery { column-count: 1; }
  .andrey-gallery-item { min-height: 0; }
}
`;
let profileCss = fs.readFileSync(profileCssPath, 'utf8');
if (!profileCss.includes(photoRepairMarker)) profileCss += photoRepairCss;
fs.writeFileSync(profileCssPath, profileCss);

let home = fs.readFileSync(homePath, 'utf8');
home = replaceOnce(
  home,
  "  { label: 'CEO', href: '/ceo' },\n  { label: 'Процесс', href: '#process' },",
  "  { label: 'CEO', href: '/ceo' },\n  { label: 'Андрей', href: '/andrey-tsarev' },\n  { label: 'Процесс', href: '#process' },",
  'homepage navigation',
);
fs.writeFileSync(homePath, home);

console.log('[andrey-discoverability] photo geometry and homepage navigation are ready');
