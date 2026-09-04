const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const tsc = path.join(root, 'node_modules', 'typescript', 'bin', 'tsc');
const functions = [
  'supabase/functions/submit-lead/index.ts',
  'supabase/functions/email-open/index.ts',
  'supabase/functions/track-event/index.ts',
  'supabase/functions/submit-website-lead/index.ts',
];

for (const file of functions) {
  try {
    execFileSync(
      process.execPath,
      [
        tsc,
        file,
        '--target',
        'ES2020',
        '--module',
        'commonjs',
        '--esModuleInterop',
        '--skipLibCheck',
        '--noEmit',
        'false',
        '--noEmitOnError',
        'false',
      ],
      { cwd: root, stdio: 'ignore' }
    );
  } catch {
    // Deno globals and remote ESM imports are expected to type-error under Jest.
  }

  const output = path.join(root, file.replace(/\.ts$/, '.js'));
  if (!fs.existsSync(output)) {
    throw new Error(`Failed to compile ${file} for Jest`);
  }
}
