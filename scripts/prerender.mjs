#!/usr/bin/env node
/**
 * Build-time prerender: serves client/dist with the production server, visits every public route
 * in headless Chromium, and writes complete HTML (meta tags, JSON-LD, content) plus the dehydrated
 * query cache to dist/<route>/index.html so React hydrates without refetching.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'client/dist');
const PORT = 8499;
const BASE = `https://127.0.0.1:${PORT}`;

await fs.copyFile(path.join(DIST, 'index.html'), path.join(DIST, '_shell.html'));

const server = spawn(process.execPath, ['--env-file=.env', 'server/src/index.js'], {
  cwd: ROOT,
  env: { ...process.env, NODE_ENV: 'production', HTTPS_PORT: String(PORT) },
  stdio: ['ignore', 'pipe', 'inherit'],
});
await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('server did not start')), 20000);
  server.stdout.on('data', (d) => { if (String(d).includes('listening')) { clearTimeout(t); resolve(); } });
});
await new Promise((r) => setTimeout(r, 800)); // allow DB connection

let ok = 0;
try {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
  await ctx.addInitScript(() => localStorage.setItem('lx-consent-v1', JSON.stringify({ essential: true, analytics: false, prerender: true })));
  const page = await ctx.newPage();
  const list = await (await page.goto(`${BASE}/api/routes`)).json();
  const targets = [...list.map((u) => [u, path.join(DIST, u, 'index.html')]), ['/__lx-not-found__/', path.join(DIST, '_404.html')]];

  for (const [url, out] of targets) {
    await page.goto(BASE + url, { waitUntil: 'networkidle' });
    await page.waitForSelector('#page-title', { timeout: 15000 });
    const state = await page.evaluate(() => window.__LX_DEHYDRATE__?.());
    let html = await page.content();
    html = html
      .replaceAll(BASE, '')
      .replace(/ data-lx-ready="1"/, '')
      // drop runtime-injected preload tags (Vite adds them again on hydration; duplicates break CSS loading)
      .replace(/<link rel="modulepreload" as="script"[^>]*>/g, '')
      .replace(/<html([^>]*?)\sclass="lx-js"/, '<html$1')
      .replace(/<html([^>]*?)class="([^"]*)\blx-js\b([^"]*)"/, '<html$1class="$2$3"')
      .replace('</body>', `<script id="__LX_STATE__" type="application/json">${JSON.stringify(state).replace(/</g, '\\u003c')}</script></body>`);
    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.writeFile(out, '<!DOCTYPE html>' + html.replace(/^<!DOCTYPE html>/i, ''));
    ok++;
    console.log(`✓ ${url}`);
  }
  await browser.close();
} finally {
  server.kill();
}
console.log(`Prerendered ${ok} route(s).`);
