const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'artifacts');
const assets = [
  {
    path: 'src/images/andrey/andrey-business-school-speaking.avif',
    sha256: '834bee5580da298af817a59522b47089a45c9638a333a75fb41a8ef1f3248c01',
    width: 1200,
    height: 800,
  },
  {
    path: 'src/images/andrey/andrey-business-school-graduates.avif',
    sha256: '36bec97be1836ea2086f224a510376b8928afaccf1d9e222fe2882ff46b7d8a3',
    width: 1200,
    height: 800,
  },
  {
    path: 'src/images/andrey/andrey-google-kafka.avif',
    sha256: '7375515c8cac338655b4210c582c44f0ad38d31c47169c142e5c28e041887617',
    width: 1200,
    height: 671,
  },
  {
    path: 'src/images/andrey/andrey-academy-pitch.avif',
    sha256: 'af454c013cb3e0592391901fe43261165d2127ee34769a8d477c94ef8fd0e9f6',
    width: 1200,
    height: 800,
  },
];

async function inspectAsset(asset) {
  const absolutePath = path.join(root, asset.path);
  if (!fs.existsSync(absolutePath)) throw new Error(`[andrey-photo-metrics] Missing ${asset.path}`);

  const buffer = fs.readFileSync(absolutePath);
  const digest = crypto.createHash('sha256').update(buffer).digest('hex');
  if (digest !== asset.sha256) {
    throw new Error(`[andrey-photo-metrics] Checksum mismatch for ${asset.path}: ${digest}`);
  }

  const metadata = await sharp(buffer).metadata();
  if (metadata.width !== asset.width || metadata.height !== asset.height || metadata.format !== 'heif') {
    throw new Error(
      `[andrey-photo-metrics] Unexpected metadata for ${asset.path}: ` +
      `${metadata.width}x${metadata.height} ${metadata.format}`,
    );
  }

  return {
    path: asset.path,
    readable: true,
    width: metadata.width,
    height: metadata.height,
    format: 'avif',
    bytes: buffer.length,
    kilobytes: Number((buffer.length / 1024).toFixed(1)),
    aspectRatio: Number((metadata.width / metadata.height).toFixed(4)),
    sha256: digest,
  };
}

async function main() {
  const metrics = [];
  for (const asset of assets) metrics.push(await inspectAsset(asset));

  fs.mkdirSync(outputDir, { recursive: true });
  const target = path.join(outputDir, 'andrey-photo-metrics.json');
  fs.writeFileSync(target, `${JSON.stringify({ generatedAt: new Date().toISOString(), assets: metrics }, null, 2)}\n`);
  for (const item of metrics) {
    console.log(`[andrey-photo-metrics] VERIFIED ${item.path}: ${item.width}x${item.height}, ${item.kilobytes} KB`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
