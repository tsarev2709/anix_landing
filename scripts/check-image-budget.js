const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const limits = [
  { file: 'public/optimized/showreel-640.webp', maxKiB: 220 },
  { file: 'public/optimized/showreel-960.webp', maxKiB: 360 },
  { file: 'public/optimized/showreel-1344.webp', maxKiB: 560 },
];

let failed = false;
for (const item of limits) {
  const filePath = path.join(root, item.file);
  if (!fs.existsSync(filePath)) {
    console.error(`[budget] missing ${item.file}`);
    failed = true;
    continue;
  }

  const sizeKiB = fs.statSync(filePath).size / 1024;
  const status = sizeKiB <= item.maxKiB ? 'ok' : 'too large';
  console.log(`[budget] ${item.file}: ${sizeKiB.toFixed(1)} KiB (${status}, max ${item.maxKiB} KiB)`);
  if (sizeKiB > item.maxKiB) failed = true;
}

if (failed) process.exit(1);
