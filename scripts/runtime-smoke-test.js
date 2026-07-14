const { spawn, spawnSync } = require('child_process');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'build');
const port = Number(process.env.SMOKE_TEST_PORT || 4173);
const baseUrl = `http://127.0.0.1:${port}`;

const routes = [
  { path: '/', marker: 'class="design1-test"', extraMarker: 'd1-showreel-poster' },
  { path: '/medicine/', marker: 'class="medicine-page"' },
  { path: '/hse/', marker: 'class="hse-page"' },
  { path: '/cases/', marker: 'class="cases-hub-page"', extraMarker: 'cases-hub-category' },
  { path: '/cases/b2b/', marker: 'class="cases-hub-page cases-category-page"', extraMarker: 'Технологии, B2B и сложные продукты' },
  { path: '/cases/medicine/', marker: 'class="cases-hub-page cases-category-page"', extraMarker: 'Pharma, MedTech и медицина' },
  { path: '/cases/cinema/', marker: 'class="cases-hub-page cases-category-page"', extraMarker: 'Cinema &amp; Creative' },
  { path: '/cases/hse/', marker: 'class="cases-hub-page cases-category-page"', extraMarker: 'Охрана труда' },
];

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'google-chrome-stable',
    'google-chrome',
    'chromium',
    'chromium-browser',
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (candidate.includes(path.sep) && fs.existsSync(candidate)) return candidate;
    const resolved = spawnSync('which', [candidate], { encoding: 'utf8' });
    if (resolved.status === 0 && resolved.stdout.trim()) return resolved.stdout.trim();
  }

  throw new Error('Chrome/Chromium was not found. Set CHROME_PATH or install a browser on the CI runner.');
}

function waitForServer(timeoutMs = 15000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const probe = () => {
      const request = http.get(`${baseUrl}/`, (response) => {
        response.resume();
        if (response.statusCode && response.statusCode < 500) {
          resolve();
          return;
        }
        retry();
      });

      request.on('error', retry);
      request.setTimeout(1000, () => request.destroy());
    };

    const retry = () => {
      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`Static server did not become ready within ${timeoutMs}ms`));
        return;
      }
      setTimeout(probe, 250);
    };

    probe();
  });
}

function runRoute(chromePath, route) {
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'anix-smoke-chrome-'));
  const url = `${baseUrl}${route.path}`;
  const result = spawnSync(
    chromePath,
    [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-sync',
      '--no-first-run',
      '--enable-logging=stderr',
      '--virtual-time-budget=8000',
      `--user-data-dir=${profileDir}`,
      '--dump-dom',
      url,
    ],
    {
      encoding: 'utf8',
      timeout: 30000,
      maxBuffer: 20 * 1024 * 1024,
    },
  );

  fs.rmSync(profileDir, { recursive: true, force: true });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Chrome failed for ${route.path} with exit code ${result.status}\n${result.stderr}`);
  }

  const dom = result.stdout || '';
  const stderr = result.stderr || '';
  const fatalRuntimePattern = /(?:Uncaught\s+)?(?:ReferenceError|TypeError|SyntaxError):/i;

  if (fatalRuntimePattern.test(stderr)) {
    throw new Error(`Runtime error on ${route.path}:\n${stderr}`);
  }

  if (!dom.includes(route.marker)) {
    throw new Error(
      `React did not render ${route.path}. Expected DOM marker ${route.marker}. ` +
        `The page may have crashed and remained on the static SEO shell.`,
    );
  }

  if (route.extraMarker && !dom.includes(route.extraMarker)) {
    throw new Error(`Route ${route.path} rendered, but required marker ${route.extraMarker} is missing.`);
  }

  if (dom.includes('data-seo-shell="true"')) {
    throw new Error(`Route ${route.path} still contains the static SEO shell after the runtime render.`);
  }

  console.log(`[runtime-smoke] PASS ${route.path}`);
}

async function main() {
  if (!fs.existsSync(path.join(buildDir, 'index.html'))) {
    throw new Error('build/index.html is missing. Run npm run build before the runtime smoke test.');
  }

  const chromePath = findChrome();
  console.log(`[runtime-smoke] Browser: ${chromePath}`);

  const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', buildDir], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let serverError = '';
  server.stderr.on('data', (chunk) => {
    serverError += chunk.toString();
  });

  try {
    await waitForServer();
    for (const route of routes) runRoute(chromePath, route);
    console.log('[runtime-smoke] All production routes rendered successfully.');
  } finally {
    server.kill('SIGTERM');
  }

  if (server.exitCode && server.exitCode !== 0) {
    throw new Error(`Static server exited unexpectedly: ${serverError}`);
  }
}

main().catch((error) => {
  console.error(`[runtime-smoke] FAIL ${error.stack || error.message}`);
  process.exit(1);
});
