import { chromium } from '@playwright/test';
const out = process.argv[2];
const b = await chromium.launch();
for (const [w, dpr] of [[1440, 2], [390, 3]]) {
  const p = await b.newPage({ ignoreHTTPSErrors: true, viewport: { width: w, height: 900 }, deviceScaleFactor: dpr });
  await p.addInitScript(() => localStorage.setItem('lx-consent-v1', '{"analytics":false}'));
  const errs = []; p.on('response', (r) => r.status() >= 400 && errs.push(r.status() + ' ' + r.url()));
  await p.goto('https://127.0.0.1:8443/', { waitUntil: 'networkidle' });
  await p.waitForSelector('html[data-lx-ready="1"]');
  await p.locator('header').screenshot({ path: `${out}/hdr-${w}.png` });
  await p.locator('footer').screenshot({ path: `${out}/ftr-${w}.png`, clip: undefined });
  console.log(w, 'logo imgs:', await p.locator('img[src*="lexium-logo"]').count(), 'errors:', errs);
  await p.close();
}
await b.close();
