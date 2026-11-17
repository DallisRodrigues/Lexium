import { chromium } from '@playwright/test';
const b = await chromium.launch(); const p = await b.newPage({ ignoreHTTPSErrors: true });
p.on('console', (m) => m.text().includes('hydration') || m.text().includes('Hydration') ? console.log(m.text().slice(0, 1500)) : null);
await p.goto('https://127.0.0.1:8443' + (process.argv[2] || '/industries/medical-devices-diagnostics/'), { waitUntil: 'networkidle' });
await b.close();
