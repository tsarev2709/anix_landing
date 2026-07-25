const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'artifacts');
const assets = [
  'src/images/andrey/andrey-portrait.webp',
  'src/images/andrey/andrey-theatre-promo.webp',
  'src/images/andrey/andrey-tochka-theatre.webp',
  'src/images/andrey/andrey-business-school-speaking.webp',
  'src/images/andrey/andrey-google-kafka.webp',
];

async function main() {
  const metrics = [];
  for (const relativePath of assets) {
    const absolutePath = path.join(root, relativePath);
    if (!fs.existsSync(absolutePath)) throw new Error(`[andrey-photo-metrics] Missing ${relativePath}`);
    const metadata = await sharp(absolutePath).metadata();
    const stat = fs.statSync(absolutePath);
    if (!metadata.width || !metadata.height) throw new Error(`[andrey-photo-metrics] Invalid dimensions for ${relativePath}`);
    const warnings = [];
    if (metadata.width < 1400) warnings.push(`width ${metadata.width}px is below the preferred 1400px`);
    if (metadata.height < 900) warnings.push(`height ${metadata.height}px is below the preferred 900px`);
    if (stat.size < 120 * 1024) warnings.push(`file size ${Math.round(stat.size / 1024)}KB may indicate aggressive compression`);
    metrics.push({
      path: relativePath,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      bytes: stat.size,
      kilobytes: Number((stat.size / 1024).toFixed(1)),
      aspectRatio: Number((metadata.width / metadata.height).toFixed(4)),
      warnings,
    });
  }

  fs.mkdirSync(outputDir, { recursive: true });
  const target = path.join(outputDir, 'andrey-photo-metrics.json');
  fs.writeFileSync(target, `${JSON.stringify({ generatedAt: new Date().toISOString(), assets: metrics }, null, 2)}\n`);
  for (const item of metrics) {
    const warningText = item.warnings.length ? `; WARN: ${item.warnings.join('; ')}` : '';
    console.log(`[andrey-photo-metrics] ${item.path}: ${item.width}x${item.height}, ${item.kilobytes} KB${warningText}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
