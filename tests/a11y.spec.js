import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { consent, TEMPLATES } from './helpers.js';

for (const p of [...TEMPLATES, '/admin/styleguide/']) {
  for (const w of [1440, 390]) {
    test(`axe: ${p} at ${w}px has no critical or serious issues`, async ({ page, context }) => {
      await consent(context);
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(p, { waitUntil: 'networkidle' });
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      const bad = r.violations.filter((v) => ['critical', 'serious'].includes(v.impact));
      expect(bad.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' ; ')}`), p).toEqual([]);
    });
  }
}
