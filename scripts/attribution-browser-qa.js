// Runs against the local production build in PR CI and the exact deployed revision.
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const WebSocket = require('ws');
const root = path.resolve(__dirname, '..');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4186';
const output = path.join(root, 'artifacts', 'attribution-qa');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function json(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(10000), cache: 'no-store' });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  return response.json();
}
async function until(check, label, timeout = 30000) {
  const start = Date.now();
  let error;
  while (Date.now() - start < timeout) {
    try { const result = await check(); if (result) return result; } catch (e) { error = e; }
    await sleep(250);
  }
  throw new Error(label + ': ' + (error?.message || 'timeout'));
}
function chromePath() {
  const candidates = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'google-chrome', 'chromium'];
  for (const candidate of candidates.filter(Boolean)) {
    if (path.isAbsolute(candidate) && fs.existsSync(candidate)) return candidate;
    const result = spawnSync('which', [candidate], { encoding: 'utf8' });
    if (result.status === 0) return result.stdout.trim();
  }
  throw new Error('Chrome not found');
}
async function connect(url, errors) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => { socket.once('open', resolve); socket.once('error', reject); });
  let id = 0;
  const pending = new Map();
  socket.on('message', raw => {
    const message = JSON.parse(raw);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error')
      errors.push({ console: message.params.args.map(arg => arg.value || arg.description).join(' ') });
    if (!pending.has(message.id)) return;
    const { resolve, reject, timer } = pending.get(message.id);
    pending.delete(message.id); clearTimeout(timer);
    if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
  });
  return { socket, send: (method, params = {}) => new Promise((resolve, reject) => {
    const key = ++id;
    const timer = setTimeout(() => { pending.delete(key); reject(new Error(method + ' timed out')); }, 35000);
    pending.set(key, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: key, method, params }));
  }) };
}
async function main() {
  fs.mkdirSync(output, { recursive: true });
  let server;
  if (!process.env.QA_BASE_URL) server = spawn(process.execPath, ['scripts/serve-build.js', '4186'], { cwd: root, stdio: 'ignore', windowsHide: true });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'anix-attribution-qa-'));
  const chrome = spawn(chromePath(), ['--headless=new','--no-sandbox','--disable-dev-shm-usage','--no-first-run',
    '--remote-debugging-port=9386', '--remote-debugging-address=127.0.0.1', '--user-data-dir=' + profile, 'about:blank'],
    { stdio: 'ignore', windowsHide: true });
  let cdp;
  const errors = [], results = [];
  try {
    if (process.env.QA_EXPECTED_SHA) await until(async () =>
      (await json(base + '/deployment.json?t=' + Date.now())).sha === process.env.QA_EXPECTED_SHA,
    'Expected production revision', 300000);
    const target = await until(async () => (await json('http://127.0.0.1:9386/json/list')).find(t => t.type === 'page'), 'Chrome');
    cdp = await connect(target.webSocketDebuggerUrl, errors);
    await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
    const evaluate = async expression => {
      const result = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    for (const [device, width, height] of [['desktop',1440,1000], ['mobile',390,844]]) {
      await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: device === 'mobile' });
      let home;
      for (const [name, route, selector] of [
        ['home','/','.design1-test'], ['utm','/?utm_source=telegram&utm_medium=organic&utm_campaign=qa_test','.design1-test'],
        ['medicine','/medicine/','.medicine-page'], ['hse','/hse/','.hse-page'], ['cases','/cases/','.cases-hub-page'],
        ['builder','/internal/utm-builder/','.utm-builder'],
      ]) {
        errors.length = 0;
        const navigation = await cdp.send('Page.navigate', { url: base + route });
        if (navigation.errorText) throw new Error(navigation.errorText);
        await until(() => evaluate('!!document.querySelector(' + JSON.stringify(selector) + ') && !document.querySelector("[data-seo-shell]")'), device + ' ' + route);
        await sleep(700);
        const state = await evaluate(`(() => {
          const form = document.querySelector('#website-lead-form');
          const visitor = JSON.parse(localStorage.getItem('anix_visitor_v2') || 'null');
          return { h1: document.querySelector('h1')?.textContent, width: document.documentElement.scrollWidth,
            fields: form ? [...form.querySelectorAll('input,textarea,select')].map(e => e.name).filter(Boolean).sort() : [],
            telegram: !!document.querySelector('a[href^="https://t.me/anix_helper"]'),
            chat: !!document.querySelector('button[aria-label="Спросить Anix"]'),
            source: visitor?.last_touch?.source, visitor: !!visitor?.id,
            robots: document.querySelector('meta[name="robots"]')?.content };
        })()`);
        if (state.width > width + 1) throw new Error('Horizontal overflow: ' + device + ' ' + route);
        if (name === 'builder') {
          if (!state.robots?.includes('noindex')) throw new Error('Builder is indexable');
        } else {
          if (!state.fields.length || !state.telegram || !state.visitor) throw new Error('Missing form, Telegram or visitor: ' + route);
          if (name === 'home') home = state;
          if (name === 'utm') {
            if (state.h1 !== home.h1 || JSON.stringify(state.fields) !== JSON.stringify(home.fields) || state.source !== 'telegram')
              throw new Error('UTM changed UI or did not persist');
          }
          if (state.chat) {
            await evaluate('document.querySelector(\'button[aria-label="Спросить Anix"]\').click()');
            await until(() => evaluate('!!document.querySelector(\'[aria-label="Сообщение для Anix"]\')'), 'Chat input');
            await evaluate('document.querySelector(\'button[aria-label="Закрыть чат"]\').click()');
          }
        }
        const fatal = errors.filter(e => !JSON.stringify(e).includes('ResizeObserver loop'));
        if (fatal.length) throw new Error('Browser errors on ' + route + ': ' + JSON.stringify(fatal));
        const shot = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
        fs.writeFileSync(path.join(output, device + '-' + name + '.png'), Buffer.from(shot.data, 'base64'));
        results.push({ device, route, state, warnings: [...errors] });
        console.log('PASS ' + device + ' ' + route);
      }
    }
  } finally {
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify({ base, sha: process.env.QA_EXPECTED_SHA || 'local', results, errors }, null, 2));
    if (cdp) { try { await cdp.send('Browser.close'); } catch { /* already closed */ } cdp.socket.terminate(); }
    chrome.kill(); server?.kill();
    await sleep(700);
    if (path.dirname(path.resolve(profile)) !== path.resolve(os.tmpdir()) || !path.basename(profile).startsWith('anix-attribution-qa-')) throw new Error('Unsafe temp path');
    try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch { console.warn('Temporary Chrome profile remains: ' + profile); }
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
