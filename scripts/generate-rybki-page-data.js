const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'public', 'rybki-assets');

function main() {
  const missing = [];
  for (let index = 1; index <= 10; index += 1) {
    const file = path.join(sourceDir, `Слайд ${index}.pdf`);
    if (!fs.existsSync(file)) missing.push(path.basename(file));
  }

  if (missing.length) {
    throw new Error(`Missing Rybki PDF slides: ${missing.join(', ')}`);
  }

  console.log('[rybki] verified 10 uploaded PDF slides; legacy layered SVG generation is disabled');
}

try {
  main();
} catch (error) {
  console.error('[rybki] slide verification failed', error);
  process.exit(1);
}
