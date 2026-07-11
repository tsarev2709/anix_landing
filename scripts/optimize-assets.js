const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'src', 'images', '3.png');
const outputDir = path.join(root, 'public', 'optimized');
const widths = [640, 960, 1344];

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  const metadata = await sharp(source).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error('Cannot read showreel poster dimensions');
  }

  for (const width of widths) {
    const output = path.join(outputDir, `showreel-${width}.webp`);
    await sharp(source)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toFile(output);

    const bytes = fs.statSync(output).size;
    console.log(`[assets] ${path.basename(output)} ${(bytes / 1024).toFixed(1)} KiB`);
  }

  const sourceBytes = fs.statSync(source).size;
  console.log(`[assets] source poster ${(sourceBytes / 1024).toFixed(1)} KiB`);
}

main().catch((error) => {
  console.error('[assets] optimization failed', error);
  process.exit(1);
});
