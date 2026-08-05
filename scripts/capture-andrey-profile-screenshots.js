const { spawn, spawnSync } = require('child_process');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'build');
const outputDir = path.join(root, 'artifacts', 'andrey-profile');
const serverPort = Number(process.env.ANDREY_SCREENSHOT_PORT || 4181);
const debugPortBase = Number(process.env.ANDREY_DEBUG_PORT || 9281);
const baseUrl = `http://127.0.0.1:${serverPort}`;

function findChrome() {
  const candidates = [process.env.CHROME_PATH, 'google-chrome-stable', 'google-chrome', 'chromium', 'chromium-browser'].filter(Boolean);
  for (const candidate of candidates) {
    if (candidate.includes(path.sep) && fs.existsSync(candidate)) return candidate;
    const resolved = spawnSync('which', [candidate], { encoding: 'utf8' });
    if (resolved.status === 0 && resolved.stdout.trim()) return resolved.stdout.trim();
  }
  throw new Error('Chrome/Chromium was not found.');
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => {
        if (!response.statusCode || response.statusCode >= 400) {
          reject(new Error(`HTTP ${response.statusCode || 'unknown'} for ${url}`));
          return;
        }
        try { resolve(JSON.parse(body)); } catch (error) { reject(error); }
      });
    });
    request.on('error', reject);
    request.setTimeout(1200, () => request.destroy(new Error(`Timeout for ${url}`)));
  });
}

async function waitFor(check, label, timeoutMs = 15000) {
  const startedAt = Date.now();
  let lastError;
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const value = await check();
      if (value) return value;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`${label} was not ready in ${timeoutMs}ms${lastError ? `: ${lastError.message}` : ''}`);
}

function connectCdp(webSocketDebuggerUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketDebuggerUrl);
    const pending = new Map();
    let nextId = 1;

    socket.once('open', () => {
      const send = (method, params = {}) => new Promise((commandResolve, commandReject) => {
        const id = nextId++;
        pending.set(id, { resolve: commandResolve, reject: commandReject, method });
        socket.send(JSON.stringify({ id, method, params }));
      });
      resolve({ socket, send });
    });
    socket.on('message', (raw) => {
      const message = JSON.parse(raw.toString());
      if (!message.id || !pending.has(message.id)) return;
      const command = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) command.reject(new Error(`${command.method}: ${message.error.message}`));
      else command.resolve(message.result || {});
    });
    socket.once('error', reject);
    socket.once('close', () => {
      for (const command of pending.values()) command.reject(new Error('Chrome DevTools connection closed'));
      pending.clear();
    });
  });
}

async function capture(chromePath, name, width, height, selector, index) {
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'anix-andrey-shot-'));
  const debugPort = debugPortBase + index;
  const target = path.join(outputDir, `${name}.png`);
  const chrome = spawn(chromePath, [
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
    '--force-device-scale-factor=1',
    `--remote-debugging-port=${debugPort}`,
    '--remote-debugging-address=127.0.0.1',
    `--user-data-dir=${profileDir}`,
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  let chromeError = '';
  chrome.stderr.on('data', (chunk) => { chromeError += chunk.toString(); });

  let cdp;
  try {
    const pageTarget = await waitFor(async () => {
      const targets = await getJson(`http://127.0.0.1:${debugPort}/json/list`);
      return targets.find((item) => item.type === 'page' && item.webSocketDebuggerUrl);
    }, `Chrome debugger for ${name}`);
    cdp = await connectCdp(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width <= 680,
      screenWidth: width,
      screenHeight: height,
    });
    await cdp.send('Page.navigate', { url: `${baseUrl}/andrey-tsarev/` });
    await new Promise((resolve) => setTimeout(resolve, 900));

    const expression = `
      (async () => {
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const startedAt = Date.now();
        while (!document.querySelector('.andrey-page') && Date.now() - startedAt < 15000) await sleep(100);
        if (!document.querySelector('.andrey-page')) throw new Error('Andrey profile did not render');
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
        await Promise.all(Array.from(document.images).map((image) => image.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              image.addEventListener('load', resolve, { once: true });
              image.addEventListener('error', resolve, { once: true });
            })));
        const selector = ${JSON.stringify(selector)};
        if (selector) {
          const target = document.querySelector(selector);
          if (!target) throw new Error('Screenshot target not found: ' + selector);
          target.scrollIntoView({ block: 'start', inline: 'nearest' });
        } else {
          window.scrollTo(0, 0);
        }
        await sleep(700);
        return { scrollY: window.scrollY, width: document.documentElement.scrollWidth, viewport: window.innerWidth };
      })()
    `;
    const evaluation = await cdp.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (evaluation.exceptionDetails) throw new Error(`Page preparation failed for ${name}`);
    const pageState = evaluation.result && evaluation.result.value;
    if (!pageState || pageState.width > width + 1) {
      throw new Error(`Horizontal overflow in ${name}: document ${pageState ? pageState.width : 'unknown'}px, viewport ${width}px`);
    }
    if (selector && pageState.scrollY < 500) {
      throw new Error(`Gallery screenshot did not scroll: ${pageState.scrollY}px`);
    }

    const screenshot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: false,
    });
    fs.writeFileSync(target, Buffer.from(screenshot.data, 'base64'));
    const stat = fs.statSync(target);
    if (stat.size < 20 * 1024) throw new Error(`Screenshot ${name} looks empty (${stat.size} bytes)`);
    console.log(`[andrey-screenshot] ${name}: ${Math.round(stat.size / 1024)} KB, scrollY ${Math.round(pageState.scrollY)}`);
  } finally {
    if (cdp && cdp.socket.readyState === WebSocket.OPEN) cdp.socket.close();
    chrome.kill('SIGTERM');
    fs.rmSync(profileDir, { recursive: true, force: true });
  }
  if (chrome.exitCode && chrome.exitCode !== 0) throw new Error(`Chrome exited unexpectedly for ${name}: ${chromeError}`);
}

async function main() {
  if (!fs.existsSync(path.join(buildDir, 'index.html'))) throw new Error('build/index.html is missing.');
  fs.mkdirSync(outputDir, { recursive: true });
  const chromePath = findChrome();
  const server = spawn('python3', ['-m', 'http.server', String(serverPort), '--bind', '127.0.0.1', '--directory', buildDir], { stdio: ['ignore', 'pipe', 'pipe'] });
  let serverError = '';
  server.stderr.on('data', (chunk) => { serverError += chunk.toString(); });
  try {
    await waitFor(async () => {
      const response = await new Promise((resolve, reject) => {
        const request = http.get(`${baseUrl}/`, (result) => { result.resume(); resolve(result.statusCode); });
        request.on('error', reject);
      });
      return response && response < 500;
    }, 'Static server');
    await capture(chromePath, 'desktop-hero', 1440, 1600, null, 0);
    await capture(chromePath, 'desktop-gallery', 1440, 1800, '#gallery', 1);
    await capture(chromePath, 'mobile-hero', 390, 1500, null, 2);
    await capture(chromePath, 'mobile-gallery', 390, 1700, '#gallery', 3);
  } finally {
    server.kill('SIGTERM');
  }
  if (server.exitCode && server.exitCode !== 0) throw new Error(`Static server exited unexpectedly: ${serverError}`);
}

main().catch((error) => {
  console.error(`[andrey-screenshot] FAIL ${error.stack || error.message}`);
  process.exit(1);
});
