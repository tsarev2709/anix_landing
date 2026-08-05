const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const assetDir = path.join(root, 'src', 'images', 'andrey', 'profile');
const manifestPath = path.join(root, 'build', 'asset-manifest.json');

const expected = [
  ['andrey-profile-theatre-promo.webp', 1405, 937],
  ['andrey-profile-portrait.webp', 1800, 1200],
  ['andrey-profile-business-school-speaking.webp', 1800, 1200],
  ['andrey-profile-novator-moscow.webp', 1280, 853],
  ['andrey-profile-business-school-graduates.webp', 1800, 1200],
  ['andrey-profile-tochka-theatre.webp', 1200, 800],
  ['andrey-profile-kafka.webp', 1712, 958],
  ['andrey-profile-academy-pitch.webp', 1800, 1200],
];

async function main() {
  if (!fs.existsSync(manifestPath)) throw new Error('[andrey-photos] build/asset-manifest.json is missing');
  const manifestText = fs.readFileSync(manifestPath, 'utf8');

  for (const [file, width, height] of expected) {
    const sourcePath = path.join(assetDir, file);
    if (!fs.existsSync(sourcePath)) throw new Error(`[andrey-photos] Missing ${file}`);
    const stat = fs.statSync(sourcePath);
    if (stat.size < 30 * 1024) throw new Error(`[andrey-photos] ${file} is unexpectedly small (${stat.size} bytes)`);
    const metadata = await sharp(sourcePath).metadata();
    if (metadata.format !== 'webp') throw new Error(`[andrey-photos] ${file} is not WebP`);
    if (metadata.width !== width || metadata.height !== height) {
      throw new Error(`[andrey-photos] ${file} dimensions are ${metadata.width}x${metadata.height}, expected ${width}x${height}`);
    }
    if (!manifestText.includes(path.basename(file, '.webp'))) {
      throw new Error(`[andrey-photos] Built asset manifest does not contain ${file}`);
    }
    console.log(`[andrey-photos] ${file}: ${width}x${height}, ${Math.round(stat.size / 1024)} KB`);
  }

  console.log('[andrey-photos] eight original photographs are valid and included in the production build');
}

main().catch((error) => {
  console.error(`[andrey-photos] FAIL ${error.stack || error.message}`);
  process.exit(1);
});
