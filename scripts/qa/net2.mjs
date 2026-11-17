import { chromium } from '@playwright/test';
const b = await chromium.launch(); const p = await b.newPage({ ignoreHTTPSErrors: true });
await p.goto('https://127.0.0.1:8443/robots.txt');
const css = process.argv[2];
console.log(await p.evaluate(async (u) => {
  const out = [];
  for (const mode of ['cors', 'no-cors', 'same-origin']) {
    try { const r = await fetch(u, { mode, cache: 'no-store' }); out.push(mode + ' ' + r.status + ' ' + (await r.text()).length); } catch (e) { out.push(mode + ' ERR ' + e.message); }
  }
  return out;
}, css));
await b.close();
