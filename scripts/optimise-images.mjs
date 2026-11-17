#!/usr/bin/env node
// sharp → AVIF + WebP at 480/768/1200/1600/2400, a 4:5 mobile crop, and a 20px blurred placeholder.
// Writes client/src/content/image-manifest.json used by <Picture>.
import fs from 'node:fs/promises';
import path from 'node:path';
import { sharp } from '../server/src/deps.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const RAW = path.join(ROOT, 'client/public/images/raw');
const OUT = path.join(ROOT, 'client/public/images');
const MANIFEST = path.join(ROOT, 'client/src/content/image-manifest.json');
const WIDTHS = [480, 768, 1200, 1600, 2400];

const files = (await fs.readdir(RAW).catch(() => [])).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const manifest = JSON.parse(await fs.readFile(MANIFEST, 'utf8').catch(() => '{}'));
for (const f of files) {
  const name = path.parse(f).name;
  const src = path.join(RAW, f);
  const meta = await sharp(src).metadata();
  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (!widths.length) widths.push(meta.width);
  for (const w of widths) {
    const base = sharp(src).rotate().resize({ width: w });
    await base.clone().avif({ quality: 50, effort: 4 }).toFile(path.join(OUT, `${name}-${w}.avif`));
    await base.clone().webp({ quality: 72 }).toFile(path.join(OUT, `${name}-${w}.webp`));
  }
  const mobile = sharp(src).rotate().resize({ width: 768, height: 960, fit: 'cover', position: 'attention' });
  await mobile.clone().avif({ quality: 50 }).toFile(path.join(OUT, `${name}-mobile.avif`));
  await mobile.clone().webp({ quality: 72 }).toFile(path.join(OUT, `${name}-mobile.webp`));
  const lqip = await sharp(src).resize(20).blur(1).webp({ quality: 40 }).toBuffer();
  const h = Math.round((meta.height / meta.width) * Math.min(meta.width, 1600));
  manifest[`/images/${name}`] = { widths, width: Math.min(meta.width, 1600), height: h, mobileSrc: `/images/${name}-mobile`, placeholder: `data:image/webp;base64,${lqip.toString('base64')}` };
  console.log(`✓ ${name} → ${widths.join('/')}`);
}
await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`${files.length} image(s) optimised. Manifest: ${path.relative(ROOT, MANIFEST)}`);
