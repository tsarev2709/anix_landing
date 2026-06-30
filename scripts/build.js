const { spawnSync } = require('child_process');
const path = require('path');

const reactScripts = path.resolve(
  __dirname,
  '..',
  'node_modules',
  'react-scripts',
  'bin',
  'react-scripts.js'
);

const result = spawnSync(process.execPath, [reactScripts, 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    CI: 'false',
    GENERATE_SOURCEMAP: 'false',
    INLINE_RUNTIME_CHUNK: 'false',
  },
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status === null ? 1 : result.status);
