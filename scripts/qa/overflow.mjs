import { chromium } from '@playwright/test';
const [, , path = '/', w = '1024'] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({ ignoreHTTPSErrors: true, viewport: { width: +w, height: 900 } });
await p.addInitScript(() => localStorage.setItem('lx-consent-v1', '{"analytics":false}'));
await p.goto('https://127.0.0.1:8443' + path, { waitUntil: 'networkidle' });
console.log(await p.evaluate((W) => [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.right > W + 1 && r.width > 0; })
  .filter((e) => !e.parentElement || e.parentElement.getBoundingClientRect().right <= W + 1).slice(0, 8)
  .map((e) => `${e.tagName}.${String(e.className).slice(0, 90)} right=${Math.round(e.getBoundingClientRect().right)}`), +w));
await b.close();
