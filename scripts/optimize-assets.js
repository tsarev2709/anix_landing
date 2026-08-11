const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'public', 'optimized');
const showreelSource = path.join(root, 'src', 'images', '3.png');
const showreelWidths = [640, 960, 1344];

async function optimizeResponsive(source, basename, widths, quality) {
  const metadata = await sharp(source).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Cannot read dimensions for ${source}`);
  }

  for (const width of widths) {
    const output = path.join(outputDir, `${basename}-${width}.webp`);
    await sharp(source)
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

  console.log('[assets] Rybki slides are served from the uploaded PDF deck; no legacy SVG optimization is required');
}

main().catch((error) => {
  console.error('[assets] optimization failed', error);
  process.exit(1);
});
