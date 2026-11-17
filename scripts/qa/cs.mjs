import { chromium } from '@playwright/test';
const url = process.argv[2] || 'https://127.0.0.1:8443/services/';
const b = await chromium.launch(); const p = await b.newPage({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 } });
p.on('console', (m) => console.log('console:', m.text().slice(0, 200)));
await p.goto(url, { waitUntil: 'networkidle' });
console.log(await p.evaluate(() => {
  const g = (sel, prop) => { const e = document.querySelector(sel); return e ? `${sel} ${prop}=${getComputedStyle(e)[prop]}` : sel + ' missing'; };
  return [g('body', 'fontFamily'), g('.btn', 'display'), g('.container-lx', 'maxWidth'), g('footer .grid', 'display'), document.styleSheets.length, [...document.querySelectorAll('link[rel=stylesheet],style')].map((l) => l.outerHTML.slice(0, 120))];
}));
await b.close();
