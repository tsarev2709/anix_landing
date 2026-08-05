const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const profilePath = path.join(root, 'src', 'components', 'AndreyProfilePage.jsx');
const homePath = path.join(root, 'src', 'components', 'Design1TestPage.jsx');
const assetDir = path.join(root, 'src', 'images', 'andrey', 'profile');

const requiredAssets = [
  'andrey-profile-theatre-promo.webp',
  'andrey-profile-portrait.webp',
  'andrey-profile-business-school-speaking.webp',
  'andrey-profile-novator-moscow.webp',
  'andrey-profile-business-school-graduates.webp',
  'andrey-profile-tochka-theatre.webp',
  'andrey-profile-kafka.webp',
  'andrey-profile-academy-pitch.webp',
];

for (const asset of requiredAssets) {
  const assetPath = path.join(assetDir, asset);
  if (!fs.existsSync(assetPath)) {
    throw new Error(`[andrey-discoverability] Missing original profile asset: ${asset}`);
  }
}

const profile = fs.readFileSync(profilePath, 'utf8');
for (const asset of requiredAssets) {
  if (!profile.includes(asset)) {
    throw new Error(`[andrey-discoverability] Profile does not import ${asset}`);
  }
}

if (!profile.includes("import './AndreyProfilePhotos.css';")) {
  throw new Error('[andrey-discoverability] Natural photo layout stylesheet is not imported');
}
if (!profile.includes('data-photo-layout="natural"')) {
  throw new Error('[andrey-discoverability] Natural hero photo layout marker is missing');
}
if (!profile.includes('id="gallery"')) {
  throw new Error('[andrey-discoverability] Gallery anchor is missing');
}
if (!profile.includes('width={photo.width}') || !profile.includes('height={photo.height}')) {
  throw new Error('[andrey-discoverability] Gallery intrinsic dimensions are missing');
}

const home = fs.readFileSync(homePath, 'utf8');
if (home.includes('/andrey-tsarev')) {
  throw new Error('[andrey-discoverability] Андрей profile is linked from the homepage');
}

console.log('[andrey-discoverability] eight original photos, natural geometry and hidden navigation verified');
