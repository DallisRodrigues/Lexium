import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const [, , p = '/', w = '1440', rule = 'target-size'] = process.argv;
const b = await chromium.launch(); const ctx = await b.newContext({ ignoreHTTPSErrors: true, viewport: { width: +w, height: 900 } });
await ctx.addInitScript(() => localStorage.setItem('lx-consent-v1', '{"analytics":false}'));
const page = await ctx.newPage(); await page.goto('https://127.0.0.1:8443' + p, { waitUntil: 'networkidle' });
const r = await new AxeBuilder({ page }).withRules([rule]).analyze();
for (const v of r.violations) for (const n of v.nodes.slice(0, 4)) console.log(n.target.join(' '), '\n  ', n.failureSummary.replace(/\n/g, ' | ').slice(0, 300));
await b.close();
