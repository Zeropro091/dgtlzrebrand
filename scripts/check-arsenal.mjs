// Quick render check of Home ARSENAL section via CDP (Chrome DevTools Protocol).
// Usage: node scripts/check-arsenal.mjs
import { spawn } from 'node:child_process';
import http from 'node:http';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9223;

const get = (url) =>
  new Promise((resolve, reject) => {
    http
      .get(url, (r) => {
        let d = '';
        r.on('data', (c) => (d += c));
        r.on('end', () => resolve(JSON.parse(d)));
      })
      .on('error', reject);
  });

const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`,
  '--headless=new',
  '--no-first-run',
  '--user-data-dir=' + process.env.TEMP + '/dgtlz-check-profile',
  '--disable-gpu',
  'about:blank',
], { stdio: 'ignore' });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  let targets;
  for (let i = 0; i < 30; i++) {
    await wait(500);
    try {
      targets = await get(`http://127.0.0.1:${PORT}/json`);
      if (targets?.length) break;
    } catch { /* retry */ }
  }
  const ws = await import('ws').catch(() => null);
  if (!ws) throw new Error('ws module not available');

  const page = targets.find((t) => t.type === 'page');
  const socket = new ws.default(page.webSocketDebuggerUrl);
  await new Promise((r) => socket.on('open', r));

  let id = 0;
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const mid = ++id;
      const onMsg = (raw) => {
        const m = JSON.parse(raw);
        if (m.id === mid) {
          socket.off('message', onMsg);
          resolve(m.result);
        }
      };
      socket.on('message', onMsg);
      socket.send(JSON.stringify({ id: mid, method, params }));
    });

  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await wait(3500);
  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const s = document.getElementById('systems');
      if (!s) return JSON.stringify({ error: 'SECTION NOT FOUND' });
      const links = [...s.querySelectorAll('a')].map(a => a.innerText.trim());
      const visit = [...s.querySelectorAll('a')].find(a => /VISIT ARSENAL/i.test(a.innerText));
      return JSON.stringify({
        h2: s.querySelector('h2')?.innerText,
        chipCount: links.filter(l => l.includes('SYS')).length,
        hasVisitBtn: !!visit,
        visitHref: visit?.getAttribute('href') || null,
        sample: links.slice(0, 8),
      });
    })()`,
    returnByValue: true,
  });

  console.log('RESULT:', evalRes.result.value);
} catch (e) {
  console.error('CHECK FAILED:', e.message);
  process.exitCode = 1;
} finally {
  chrome.kill();
}
