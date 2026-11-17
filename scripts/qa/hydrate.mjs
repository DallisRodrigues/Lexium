import { chromium } from '@playwright/test';
const BASE = process.argv[2] || 'https://127.0.0.1:8443';
const paths = ['/', '/services/', '/services/fundraising-ipo-advisory/', '/industries/', '/industries/food-nutrition-beverages/', '/insights/', '/insights/capital-readiness-founder-led-businesses/', '/about/', '/contact/', '/privacy/', '/nope/', '/admin/'];
const b = await chromium.launch();
const ctx = await b.newContext({ ignoreHTTPSErrors: true });
for (const p of paths) {
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && errs.push(m.text().slice(0, 160)));
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message.slice(0, 160)));
  const r = await page.goto(BASE + p, { waitUntil: 'networkidle' });
  console.log(p, r.status(), (await page.title()).slice(0, 60), errs.length ? errs : 'clean');
  await page.close();
}
await b.close();
