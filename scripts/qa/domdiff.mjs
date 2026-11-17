import { chromium } from '@playwright/test';
import fs from 'node:fs';
const url = 'https://127.0.0.1:8443' + (process.argv[2] || '/contact/');
const b = await chromium.launch();
const norm = (h) => h.replace(/ style="[^"]*"/g, '').replace(/></g, '>\n<');
// 1) server HTML, no JS
let ctx = await b.newContext({ ignoreHTTPSErrors: true, javaScriptEnabled: false });
let p = await ctx.newPage(); await p.goto(url);
const server = norm(await p.locator('#root').innerHTML()); await ctx.close();
// 2) client-only render: strip root content, keep state
ctx = await b.newContext({ ignoreHTTPSErrors: true });
p = await ctx.newPage();
await p.route(url, async (route) => { const r = await route.fetch(); let html = await r.text(); html = html.replace(/<div id="root">[\s\S]*?<\/div>(?=\s*<script id="__LX_STATE__")/, '<div id="root"></div>'); await route.fulfill({ response: r, body: html }); });
await p.goto(url, { waitUntil: 'networkidle' });
const client = norm(await p.locator('#root').innerHTML()); await ctx.close(); await b.close();
fs.writeFileSync('/tmp/claude-1000/-home-dallisr-Documents-LEXIUM/11036cef-8451-4526-b876-0700110aff58/scratchpad/server.html', server);
fs.writeFileSync('/tmp/claude-1000/-home-dallisr-Documents-LEXIUM/11036cef-8451-4526-b876-0700110aff58/scratchpad/client.html', client);
