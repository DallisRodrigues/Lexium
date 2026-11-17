#!/usr/bin/env node
/**
 * Asserts that every bold quoted string in §9 of the build prompt appears verbatim on its page,
 * and that no "pharma" wording appears on any public page. Exit code 1 on failure.
 *   node scripts/verify-copy.mjs [baseUrl]   (default https://127.0.0.1:8443 — run `npm start` first)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const ROOT = path.resolve(import.meta.dirname, '..');
const BASE = process.argv[2] || 'https://127.0.0.1:8443';
const md = await fs.readFile(path.join(ROOT, 'LEXIUM_MERN_BUILD_PROMPT.md'), 'utf8');
const sec9 = md.slice(md.indexOf('## 9. CONTENT APPENDIX'), md.indexOf('## 10. SEO'));

// Split §9 into subsections keyed by the URL in the heading.
const checks = [];
let url = null;
for (const line of sec9.split('\n')) {
  const h = line.match(/^###\s+9\.\d+\s.*?`([^`]+)`/);
  if (h) { url = h[1].replace(':slug', ''); continue; }
  if (line.startsWith('###')) { url = null; continue; }
  if (line.startsWith('**Article page**')) url = 'ARTICLE';
  if (!url) continue;
  for (const m of line.matchAll(/\*\*"([^"]+)"\*\*/g)) checks.push({ url, text: m[1] });
}
checks.push({ url: '/about/', text: 'Founded in 2018.' });
checks.push({ url: '/', text: '30+ years of sector experience, 1000+ project exposure across 50+ countries' });

const norm = (s) => s.replace(/\s+/g, ' ').trim();
const browser = await chromium.launch();
const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => localStorage.setItem('lx-consent-v1', JSON.stringify({ analytics: false })));
const page = await ctx.newPage();
const cache = new Map();
async function textOf(u) {
  if (cache.has(u)) return cache.get(u);
  await page.goto(BASE + u, { waitUntil: 'networkidle' });
  await page.waitForSelector('#page-title');
  const t = norm(await page.evaluate(() => { const b = document.body.cloneNode(true); b.querySelectorAll('script, style, template').forEach((n) => n.remove()); return document.body.innerText + ' ' + b.textContent; }));
  cache.set(u, t);
  return t;
}
const articleUrl = '/insights/' + (await (await ctx.request.get(`${BASE}/api/insights?limit=1`)).json()).items[0].slug + '/';

let fail = 0;
for (const c of checks) {
  const u = c.url === 'ARTICLE' ? articleUrl : c.url;
  const text = await textOf(u);
  const whole = text.includes(norm(c.text));
  let missing = [];
  if (!whole) {
    // Lists in the document use " | " and " → " as separators and "?" between questions.
    const parts = c.text.split(/\s\|\s|\s→\s|(?<=\?)\s/).map(norm).filter(Boolean);
    missing = parts.filter((p) => !text.includes(p));
  }
  const ok = whole || !missing.length;
  if (!ok) fail++;
  console.log(`${ok ? '✓' : '✗'} ${u}  "${c.text}"${missing.length ? `  missing: ${missing.join(' | ')}` : ''}`);
}

// No pharmaceuticals wording on any public page
const routes = await (await ctx.request.get(`${BASE}/api/routes`)).json();
for (const u of routes) {
  const t = (await textOf(u)).toLowerCase();
  if (/pharma/.test(t)) { fail++; console.log(`✗ "pharma" wording found on ${u}`); }
}
console.log(`\n${checks.length} copy checks, ${routes.length} pages scanned for pharma wording — ${fail ? `${fail} FAILURE(S)` : 'all passed'}.`);
await browser.close();
process.exit(fail ? 1 : 0);
