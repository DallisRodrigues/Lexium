import { chromium } from '@playwright/test';
const b = await chromium.launch(); const p = await b.newPage({ ignoreHTTPSErrors: true });
p.on('console', (m) => /hydrat|did not match|mismatch/i.test(m.text()) && console.log(m.text().slice(0, 20000)));
await p.goto('https://127.0.0.1:8443' + (process.argv[2] || '/contact/'), { waitUntil: 'networkidle' });
await b.close();
