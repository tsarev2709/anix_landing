const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'artifacts', 'andrey-originals');

const encodedAssets = [
  {
    name: 'andrey-theatre-promo.avif',
    dir: path.join(root, 'scripts', 'assets', 'andrey'),
    parts: ['andrey-theatre-promo.avif.b64.part-00', 'andrey-theatre-promo.avif.b64.part-01'],
  },
  {
    name: 'andrey-portrait.avif',
    dir: path.join(root, 'scripts', 'assets', 'andrey'),
    parts: ['andrey-portrait.avif.b64.part-00'],
  },
  {
    name: 'andrey-business-school-speaking.avif',
    dir: path.join(root, 'scripts', 'assets', 'andrey-restored'),
    parts: ['andrey-business-school-speaking.avif.b64.part-00'],
  },
  {
    name: 'andrey-business-school-graduates.avif',
    dir: path.join(root, 'scripts', 'assets', 'andrey-restored'),
    parts: ['andrey-business-school-graduates.avif.b64.part-00', 'andrey-business-school-graduates.avif.b64.part-01'],
  },
  {
    name: 'andrey-google-kafka.avif',
    dir: path.join(root, 'scripts', 'assets', 'andrey-restored'),
    parts: ['andrey-google-kafka.avif.b64.part-00', 'andrey-google-kafka.avif.b64.part-01'],
  },
  {
    name: 'andrey-academy-pitch.avif',
    dir: path.join(root, 'scripts', 'assets', 'andrey-restored'),
    parts: ['andrey-academy-pitch.avif.b64.part-00'],
  },
];

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

for (const asset of encodedAssets) {
  const base64 = asset.parts
    .map((part) => fs.readFileSync(path.join(asset.dir, part), 'utf8').trim())
    .join('');
  const buffer = Buffer.from(base64, 'base64');
  fs.writeFileSync(path.join(outputDir, asset.name), buffer);
  console.log(`[andrey-export] ${asset.name}: ${buffer.length} bytes`);
}

const committedDir = path.join(root, 'src', 'images', 'andrey');
for (const name of fs.readdirSync(committedDir)) {
  const source = path.join(committedDir, name);
  if (!fs.statSync(source).isFile()) continue;
  fs.copyFileSync(source, path.join(outputDir, `repo-${name}`));
}

const manifest = fs.readdirSync(outputDir)
  .filter((name) => name !== 'manifest.json')
  .sort()
  .map((name) => ({ name, size: fs.statSync(path.join(outputDir, name)).size }));
fs.writeFileSync(path.join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`[andrey-export] exported ${manifest.length} image files`);
