const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const ogDir = path.join(publicDir, 'og');
const caseOgDir = path.join(ogDir, 'cases');
const caseMediaDir = path.join(publicDir, 'seo-media', 'cases');

const routeImages = [
  { slug: 'home', source: path.join(root, 'src', 'images', '3.png') },
  { slug: 'medicine', source: path.join(root, 'src', 'images', 'cases', 'hemotech-ai.webp') },
  { slug: 'hse', source: path.join(root, 'src', 'images', 'hse', 'hse-hero.jpg') },
  { slug: 'ceo', source: path.join(root, 'src', 'images', 'ceo', 'alexandra-portrait.webp') },
  { slug: 'rybki', source: path.join(publicDir, 'rybki-page-assets', '01-cover-base-1800.webp') },
];

const caseImages = [
  ['clappy', 'clappy.webp'],
  ['hemotech-ai', 'hemotech-ai.webp'],
  ['tpes', 'tpes.webp'],
  ['mfti-endowment', 'mfti-endowment.webp'],
  ['mosfarma', 'mosfarma.webp'],
  ['multon-partners', 'multon-partners.webp'],
];

async function writeOg(source, output) {
  if (!fs.existsSync(source)) throw new Error(`SEO image source not found: ${source}`);
  await sharp(source)
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(output);
}

async function writeCaseMedia(source, output) {
  if (!fs.existsSync(source)) throw new Error(`Case image source not found: ${source}`);
  await sharp(source)
    .rotate()
    .resize(1600, 900, { fit: 'cover', position: 'attention', withoutEnlargement: true })
    .webp({ quality: 84, effort: 6 })
    .toFile(output);
}

async function main() {
  fs.mkdirSync(ogDir, { recursive: true });
  fs.mkdirSync(caseOgDir, { recursive: true });
  fs.mkdirSync(caseMediaDir, { recursive: true });

  for (const item of routeImages) {
    const output = path.join(ogDir, `${item.slug}.jpg`);
    await writeOg(item.source, output);
    console.log(`[seo-assets] ${path.relative(root, output)} ${(fs.statSync(output).size / 1024).toFixed(1)} KiB`);
  }

  for (const [slug, filename] of caseImages) {
    const source = path.join(root, 'src', 'images', 'cases', filename);
    const mediaOutput = path.join(caseMediaDir, `${slug}.webp`);
    const ogOutput = path.join(caseOgDir, `${slug}.jpg`);
    await Promise.all([writeCaseMedia(source, mediaOutput), writeOg(source, ogOutput)]);
    console.log(`[seo-assets] ${slug}: media ${(fs.statSync(mediaOutput).size / 1024).toFixed(1)} KiB; og ${(fs.statSync(ogOutput).size / 1024).toFixed(1)} KiB`);
  }
}

main().catch((error) => {
  console.error('[seo-assets] generation failed', error);
  process.exit(1);
});
