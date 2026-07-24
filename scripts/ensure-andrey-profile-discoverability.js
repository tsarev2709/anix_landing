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
  "  { src: theatreGroupPhoto, alt: 'Команда студенческого театра «Точка» МФТИ после спектакля', label: 'Театр «Точка»' },\n  { src: businessSchoolSpeakingPhoto, alt: 'Андрей Царёв выступает на дне рождения Бизнес-школы МФТИ', label: 'Выступление в Бизнес-школе МФТИ' },\n  { src: googleKafkaPhoto, alt: 'Андрей Царёв в Google-центре на фоне Франца Кафки', label: 'Google-центр / Франц Кафка' },\n];",
  'profile gallery',
);
fs.writeFileSync(profilePath, profile);

let profileCss = fs.readFileSync(profileCssPath, 'utf8');
profileCss = replaceOnce(
  profileCss,
  '.andrey-gallery-item-5 { grid-column: span 5; }',
  '.andrey-gallery-item-5 { grid-column: span 5; }\n.andrey-gallery-item-6, .andrey-gallery-item-7 { grid-column: span 6; }',
  'gallery layout',
);
fs.writeFileSync(profileCssPath, profileCss);

let home = fs.readFileSync(homePath, 'utf8');
home = replaceOnce(
  home,
  "  { label: 'CEO', href: '/ceo' },\n  { label: 'Процесс', href: '#process' },",
  "  { label: 'CEO', href: '/ceo' },\n  { label: 'Андрей', href: '/andrey-tsarev' },\n  { label: 'Процесс', href: '#process' },",
  'homepage navigation',
);
fs.writeFileSync(homePath, home);

console.log('[andrey-discoverability] gallery and homepage navigation are ready');
