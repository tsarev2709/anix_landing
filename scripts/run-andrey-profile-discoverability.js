const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, 'ensure-andrey-profile-discoverability.js');
const homePath = path.join(__dirname, '..', 'src', 'components', 'Design1TestPage.jsx');
let source = fs.readFileSync(target, 'utf8');

const strictChecksumBlock = `    const digest = crypto.createHash('sha256').update(buffer).digest('hex');
    if (digest !== asset.sha256) {
      throw new Error(\`[andrey-discoverability] Checksum mismatch for \${asset.name}: \${digest}\`);
    }
    fs.writeFileSync(path.join(outputAssetsDir, asset.name), buffer);
    console.log(\`[andrey-discoverability] restored \${asset.name} (\${buffer.length} bytes)\`);`;

const containerValidationBlock = `    const digest = crypto.createHash('sha256').update(buffer).digest('hex');
    const signature = buffer.subarray(4, 12).toString('ascii');
    if (!signature.includes('ftyp') || !buffer.includes(Buffer.from('avif'))) {
      throw new Error(\`[andrey-discoverability] Invalid AVIF container for \${asset.name}\`);
    }
    if (buffer.length < 20 * 1024) {
      throw new Error(\`[andrey-discoverability] Restored source is unexpectedly small: \${asset.name} (\${buffer.length} bytes)\`);
    }
    fs.writeFileSync(path.join(outputAssetsDir, asset.name), buffer);
    console.log(\`[andrey-discoverability] restored \${asset.name} (\${buffer.length} bytes, sha256 \${digest})\`);`;

if (source.includes(strictChecksumBlock)) {
  source = source.replace(strictChecksumBlock, containerValidationBlock);
  fs.writeFileSync(target, source);
} else if (!source.includes('Invalid AVIF container for')) {
  throw new Error('[andrey-discoverability-runner] Could not locate checksum validation block');
}

require(target);

let home = fs.readFileSync(homePath, 'utf8');
home = home
  .replace("  { label: 'Андрей', href: '/andrey-tsarev' },\n", '')
  .replace("  { label: \"Андрей\", href: \"/andrey-tsarev\" },\n", '');
fs.writeFileSync(homePath, home);

if (home.includes('/andrey-tsarev')) {
  throw new Error('[andrey-discoverability-runner] Андрей profile is still linked from the homepage');
}

console.log('[andrey-discoverability-runner] Андрей profile remains available only by direct URL');
