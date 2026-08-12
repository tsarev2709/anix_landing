const fs = require('fs');
const path = require('path');

// Lint, tests and build run sequentially in one checkout; patch source only once.
const stamp = path.resolve(__dirname, '..', '.website-lead-consent-patched');

if (fs.existsSync(stamp)) {
  console.log('Website lead consent patch already applied in this checkout.');
} else {
  const form = fs.readFileSync(
    path.resolve(__dirname, '..', 'src/components/WebsiteLeadForm.jsx'),
    'utf8'
  );
  const edgeFunction = fs.readFileSync(
    path.resolve(
      __dirname,
      '..',
      'supabase/functions/submit-website-lead/index.ts'
    ),
    'utf8'
  );
  const committedPatchPresent =
    form.includes('privacyConsent: false') &&
    form.includes('website-lead__consent') &&
    edgeFunction.includes('privacy_consent_required') &&
    edgeFunction.includes('type TurnstileResult');
  if (committedPatchPresent) {
    console.log('Website lead consent is committed in source.');
  } else {
    require('./ensure-website-lead-consent');
  }
  fs.writeFileSync(stamp, `${new Date().toISOString()}\n`);
}
