// Usage: node scripts/qa/shot.mjs <path> <width> <outfile> [full]
import { chromium } from '@playwright/test';
const [, , path = '/', w = '1440', out = 'shot.png', full] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: 900 }, ignoreHTTPSErrors: true });
const errs = [];
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
p.on('pageerror', (e) => errs.push(e.message));
await p.addInitScript(() => localStorage.setItem('lx-consent-v1', JSON.stringify({ analytics: false })));
await p.goto(`https://localhost:5173${path}`, { waitUntil: 'networkidle' });
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
await p.waitForTimeout(500);
await p.screenshot({ path: out, fullPage: !!full });
console.log(JSON.stringify({ errs, scrollW: await p.evaluate(() => document.documentElement.scrollWidth), h: await p.evaluate(() => document.body.scrollHeight) }));
await b.close();
