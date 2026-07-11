const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'public', 'optimized');
const showreelSource = path.join(root, 'src', 'images', '3.png');
const showreelWidths = [640, 960, 1344];
const rybkiWidths = [640, 1280, 1920];
const rybkiSlides = [
  '01-cover',
  '02-logline',
  '03-why-it-hooks',
  '04-synopsis',
  '05-main-character',
  '06-world',
  '08-audience',
  '09-potential',
];

async function optimizeResponsive(source, basename, widths, quality) {
  const metadata = await sharp(source).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Cannot read dimensions for ${source}`);
  }

  for (const width of widths) {
    const output = path.join(outputDir, `${basename}-${width}.webp`);
    await sharp(source, { density: 144 })
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(output);

    const bytes = fs.statSync(output).size;
    console.log(`[assets] ${path.basename(output)} ${(bytes / 1024).toFixed(1)} KiB`);
  }
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  await optimizeResponsive(showreelSource, 'showreel', showreelWidths, 78);
  console.log(`[assets] source poster ${(fs.statSync(showreelSource).size / 1024).toFixed(1)} KiB`);

  for (const slide of rybkiSlides) {
    const source = path.join(root, 'public', 'rybki-assets', `${slide}.svg`);
    if (!fs.existsSync(source)) {
      throw new Error(`Missing Rybki source slide: ${source}`);
    }
    await optimizeResponsive(source, `rybki-${slide}`, rybkiWidths, 80);
    console.log(`[assets] source ${slide}.svg ${(fs.statSync(source).size / 1024).toFixed(1)} KiB`);
  }
}

main().catch((error) => {
  console.error('[assets] optimization failed', error);
  process.exit(1);
});
