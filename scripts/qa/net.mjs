import { chromium } from '@playwright/test';
const b = await chromium.launch(); const p = await b.newPage({ ignoreHTTPSErrors: true });
p.on('requestfailed', (r) => console.log('FAILED', r.url(), r.failure()?.errorText));
p.on('response', (r) => r.url().includes('.css') && console.log('RESP', r.status(), r.url(), JSON.stringify(r.headers()).slice(0, 300)));
p.on('request', (r) => r.url().includes('.css') && console.log('REQ', r.url(), JSON.stringify(r.headers())));
await p.goto(process.argv[2] || 'https://127.0.0.1:8443/services/', { waitUntil: 'networkidle' });
await b.close();
