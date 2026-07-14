const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'public', 'rybki-assets');
const outputDir = path.join(root, 'public', 'rybki-rendered');
const widths = [720, 1280, 1920];

function commandExists(command) {
  return spawnSync('which', [command], { encoding: 'utf8' }).status === 0;
}

async function main() {
  if (!commandExists('pdftoppm')) {
    throw new Error('pdftoppm is required. Install poppler-utils before the production build.');
  }

  fs.mkdirSync(outputDir, { recursive: true });

  for (let index = 1; index <= 10; index += 1) {
    const pdf = path.join(sourceDir, `Слайд ${index}.pdf`);
    const tempPrefix = path.join(outputDir, `slide-${index}-source`);
    const png = `${tempPrefix}.png`;
    if (!fs.existsSync(pdf)) throw new Error(`Missing Rybki PDF: ${pdf}`);

    const render = spawnSync('pdftoppm', ['-f', '1', '-singlefile', '-png', '-r', '180', pdf, tempPrefix], { stdio: 'inherit' });
    if (render.status !== 0 || !fs.existsSync(png)) throw new Error(`Failed to render ${path.basename(pdf)}`);

    for (const width of widths) {
      const output = path.join(outputDir, `slide-${index}-${width}.webp`);
      await sharp(png)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: width === 1920 ? 84 : 80, effort: 6 })
        .toFile(output);
    }

    fs.unlinkSync(png);
  }
}

main().catch((error) => {
  console.error('[rybki-pdf] render failed', error);
  process.exit(1);
});
