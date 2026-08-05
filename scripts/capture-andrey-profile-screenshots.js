const { spawn, spawnSync } = require('child_process');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'build');
const outputDir = path.join(root, 'artifacts', 'andrey-profile');
const port = Number(process.env.ANDREY_SCREENSHOT_PORT || 4181);
const baseUrl = `http://127.0.0.1:${port}`;

function findChrome() {
  const candidates = [process.env.CHROME_PATH, 'google-chrome-stable', 'google-chrome', 'chromium', 'chromium-browser'].filter(Boolean);
  for (const candidate of candidates) {
    if (candidate.includes(path.sep) && fs.existsSync(candidate)) return candidate;
    const resolved = spawnSync('which', [candidate], { encoding: 'utf8' });
    if (resolved.status === 0 && resolved.stdout.trim()) return resolved.stdout.trim();
  }
  throw new Error('Chrome/Chromium was not found.');
}

function waitForServer(timeoutMs = 15000) {
  const startedAt = Date.now();
  return new Promise((resolve, reject) => {
    const probe = () => {
      const request = http.get(`${baseUrl}/`, (response) => {
        response.resume();
        if (response.statusCode && response.statusCode < 500) return resolve();
        retry();
      });
      request.on('error', retry);
      request.setTimeout(1000, () => request.destroy());
    };
    const retry = () => {
      if (Date.now() - startedAt > timeoutMs) return reject(new Error(`Static server was not ready in ${timeoutMs}ms`));
      setTimeout(probe, 250);
    };
    probe();
  });
}

function capture(chromePath, name, url, width, height) {
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'anix-andrey-shot-'));
  const target = path.join(outputDir, `${name}.png`);
  const result = spawnSync(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-sync',
    '--hide-scrollbars',
    '--no-first-run',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=10000',
    '--force-device-scale-factor=1',
    `--window-size=${width},${height}`,
    `--user-data-dir=${profileDir}`,
    `--screenshot=${target}`,
    url,
  ], { encoding: 'utf8', timeout: 45000, maxBuffer: 10 * 1024 * 1024 });
  fs.rmSync(profileDir, { recursive: true, force: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Chrome screenshot failed for ${name}:\n${result.stderr}`);
  const stat = fs.statSync(target);
  if (stat.size < 20 * 1024) throw new Error(`Screenshot ${name} looks empty (${stat.size} bytes)`);
  console.log(`[andrey-screenshot] ${name}: ${Math.round(stat.size / 1024)} KB`);
}

async function main() {
  if (!fs.existsSync(path.join(buildDir, 'index.html'))) throw new Error('build/index.html is missing.');
  fs.mkdirSync(outputDir, { recursive: true });
  const chromePath = findChrome();
  const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', buildDir], { stdio: ['ignore', 'pipe', 'pipe'] });
  let serverError = '';
  server.stderr.on('data', (chunk) => { serverError += chunk.toString(); });
  try {
    await waitForServer();
    capture(chromePath, 'desktop-hero', `${baseUrl}/andrey-tsarev/`, 1440, 1600);
    capture(chromePath, 'desktop-gallery', `${baseUrl}/andrey-tsarev/#gallery`, 1440, 1800);
    capture(chromePath, 'mobile-hero', `${baseUrl}/andrey-tsarev/`, 390, 1500);
    capture(chromePath, 'mobile-gallery', `${baseUrl}/andrey-tsarev/#gallery`, 390, 1700);
  } finally {
    server.kill('SIGTERM');
  }
  if (server.exitCode && server.exitCode !== 0) throw new Error(`Static server exited unexpectedly: ${serverError}`);
}

main().catch((error) => {
  console.error(`[andrey-screenshot] FAIL ${error.stack || error.message}`);
  process.exit(1);
});
