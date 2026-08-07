const fs = require('fs');
const path = require('path');

const stamp = path.resolve(__dirname, '..', '.website-lead-consent-patched');

if (fs.existsSync(stamp)) {
  console.log('Website lead consent patch already applied in this checkout.');
} else {
  require('./ensure-website-lead-consent');
  fs.writeFileSync(stamp, `${new Date().toISOString()}\n`);
}
