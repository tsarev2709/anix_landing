const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'build');
const manifestPath = path.join(buildDir, 'asset-manifest.json');
const outputDir = path.join(root, 'artifacts');

function fileMetric(relativePath) {
  const clean = relativePath.replace(/^\//, '');
  const filePath = path.join(buildDir, clean);
  if (!fs.existsSync(filePath)) return null;
  const sizeBytes = fs.statSync(filePath).size;
  return {
    path: `/${clean}`,
    sizeBytes,
    sizeKiB: Number((sizeBytes / 1024).toFixed(1)),
  };
}

if (!fs.existsSync(manifestPath)) throw new Error('build/asset-manifest.json not found');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const entrypoints = (manifest.entrypoints || []).map(fileMetric).filter(Boolean);
const criticalImages = [
  'optimized/showreel-640.webp',
  'optimized/showreel-960.webp',
  'optimized/showreel-1344.webp',
  'optimized/rybki-01-cover-640.webp',
  'optimized/rybki-01-cover-1280.webp',
  'seo-media/cases/hemotech-ai.webp',
].map(fileMetric).filter(Boolean);

const report = {
  generatedAt: new Date().toISOString(),
  entrypoints,
  criticalImages,
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'build-metrics.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log('[metrics]', JSON.stringify(report));
