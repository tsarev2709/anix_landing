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

async function inspectAsset(relativePath) {
  const absolutePath = path.join(root, relativePath);
  try {
    if (!fs.existsSync(absolutePath)) {
      return { path: relativePath, readable: false, error: 'missing file', warnings: ['asset is missing from the checkout'] };
    }
    const metadata = await sharp(absolutePath).metadata();
    const stat = fs.statSync(absolutePath);
    if (!metadata.width || !metadata.height) {
      return { path: relativePath, readable: false, error: 'image dimensions are unavailable', bytes: stat.size, warnings: ['asset metadata is incomplete'] };
    }
    const warnings = [];
    if (metadata.width < 1400) warnings.push(`width ${metadata.width}px is below the preferred 1400px`);
    if (metadata.height < 900) warnings.push(`height ${metadata.height}px is below the preferred 900px`);
    if (stat.size < 120 * 1024) warnings.push(`file size ${Math.round(stat.size / 1024)}KB may indicate aggressive compression`);
    return {
      path: relativePath,
      readable: true,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      bytes: stat.size,
      kilobytes: Number((stat.size / 1024).toFixed(1)),
      aspectRatio: Number((metadata.width / metadata.height).toFixed(4)),
      warnings,
    };
  } catch (error) {
    return {
      path: relativePath,
      readable: false,
      error: error.message,
      warnings: ['sharp could not decode this asset'],
    };
  }
}

async function main() {
  const metrics = [];
  for (const relativePath of assets) metrics.push(await inspectAsset(relativePath));

  fs.mkdirSync(outputDir, { recursive: true });
  const target = path.join(outputDir, 'andrey-photo-metrics.json');
  fs.writeFileSync(target, `${JSON.stringify({ generatedAt: new Date().toISOString(), assets: metrics }, null, 2)}\n`);
  for (const item of metrics) {
    if (!item.readable) {
      console.warn(`[andrey-photo-metrics] ${item.path}: UNREADABLE — ${item.error}`);
      continue;
    }
    const warningText = item.warnings.length ? `; WARN: ${item.warnings.join('; ')}` : '';
    console.log(`[andrey-photo-metrics] ${item.path}: ${item.width}x${item.height}, ${item.kilobytes} KB${warningText}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
