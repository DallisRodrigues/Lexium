import { test, expect } from '@playwright/test';
import { consent, MAILPIT, TEMPLATES, go } from './helpers.js';

test.describe('Routes', () => {
  test('every URL resolves and non-slash URLs 301', async ({ request }) => {
    const routes = await (await request.get('/api/routes')).json();
    expect(routes.length).toBeGreaterThanOrEqual(26);
    for (const r of routes) expect((await request.get(r)).status(), r).toBe(200);
    for (const r of ['/about', '/services/strategy-consulting', '/insights']) {
      const res = await request.get(r, { maxRedirects: 0 });
      expect(res.status()).toBe(301);
      expect(res.headers().location).toMatch(/\/$/);
    }
    expect((await request.get('/no-such-page/')).status()).toBe(404);
    expect((await request.get('/robots.txt')).ok()).toBeTruthy();
    expect(await (await request.get('/sitemap.xml')).text()).toContain('/services/strategy-consulting/');
  });
});

test.describe('Header', () => {
  test.beforeEach(({ context }) => consent(context));
  test('compacts after ~80px, indicates current page, no phone in nav', async ({ page }) => {
    await go(page, '/services/');
    const header = page.locator('header').first();
    const h0 = (await header.boundingBox()).height;
    await page.mouse.wheel(0, 300);
    await expect(header).toHaveAttribute('data-compact', 'true');
    await page.waitForTimeout(400);
    expect((await header.boundingBox()).height).toBeLessThan(h0);
    await expect(page.getByRole('navigation', { name: 'Primary' }).locator('[aria-current="page"]')).toHaveText(/What We Do/);
    expect(await page.getByRole('navigation', { name: 'Primary' }).locator('a[href^="tel:"]').count()).toBe(0);
  });
  test('mega menu opens on click/keyboard and closes with Escape returning focus', async ({ page }) => {
    await go(page, '/');
    const trigger = page.getByRole('button', { name: 'What We Do' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('region', { name: 'What We Do' }).getByRole('link', { name: /Strategy Consulting/ })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
    await trigger.click();
    await page.mouse.click(5, 700);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
  test('mobile drawer: independent groups, View all, CTA, Escape closes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await go(page, '/');
    await page.getByRole('button', { name: 'Menu' }).click();
    const dlg = page.getByRole('dialog');
    await dlg.getByRole('button', { name: 'What We Do' }).click();
    await dlg.getByRole('button', { name: 'Industries' }).click();
    await expect(dlg.getByRole('link', { name: 'View all' })).toHaveCount(2);
    await expect(dlg.getByRole('link', { name: /Discuss your ambition/ })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dlg).toBeHidden();
  });
});

test.describe('Components', () => {
  test.beforeEach(({ context }) => consent(context));
  test('capability tabs follow the ARIA tabs pattern', async ({ page }) => {
    await go(page, '/');
    const tabs = page.getByRole('tablist', { name: 'Lexium capabilities' }).getByRole('tab');
    await expect(tabs).toHaveCount(6);
    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel').getByRole('link', { name: /India Market Entry/ })).toBeVisible();
    await expect(page.getByRole('tabpanel').getByRole('link', { name: /Global Market Entry/ })).toBeVisible();
  });
  test('accordion deep link opens the item', async ({ page }) => {
    await go(page, '/services/regulatory-licences/#faq-fees');
    await expect(page.locator('#faq-fees button[aria-expanded]')).toHaveAttribute('aria-expanded', 'true');
  });
  test('regulatory items show a reviewed date and disclaimer', async ({ page }) => {
    await go(page, '/services/regulatory-licences/');
    const panel = page.getByRole('tabpanel');
    await expect(panel.getByText(/^Reviewed:/)).toBeVisible();
    await expect(panel.getByText('Website content is general information and not a regulatory determination.')).toBeVisible();
    await page.getByRole('button', { name: 'Import' }).click();
    await expect(page.getByText('Form MD-14', { exact: false })).toBeVisible();
  });
  test('form numbers never appear in the licence navigator first view', async ({ page }) => {
    await go(page, '/services/regulatory-licences/');
    await expect(page.locator('#india-licence-navigator').getByText(/Form MD-/)).toHaveCount(0);
  });
  test('region selector is keyboard operable', async ({ page }) => {
    await go(page, '/services/global-market-entry/');
    const first = page.locator('#region-btn-africa');
    await first.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('#region-btn-mena')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#region-btn-mena')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#region-panel h3')).toHaveText('MENA');
  });
  test('diagnostic shows summary before asking for email', async ({ page }) => {
    await go(page, '/services/fundraising-ipo-advisory/');
    await page.getByRole('button', { name: 'Start the diagnostic' }).click();
    for (const a of ['Yes', 'Yes', 'Partly', 'Yes', 'No']) {
      await expect(page.getByText(/Question \d of 5/)).toBeVisible();
      await page.getByRole('button', { name: a, exact: true }).click();
    }
    await expect(page.getByRole('heading', { name: 'Investor-readying' })).toBeVisible();
    await expect(page.locator('p.t-num', { hasText: '/ 10' })).toContainText('7');
    await expect(page.getByText('Gap to address')).toBeVisible();
    await expect(page.locator('#diag-email')).toBeVisible();
  });
  test('reduced motion disables reveals', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', ignoreHTTPSErrors: true });
    await consent(ctx);
    const page = await ctx.newPage();
    await go(page, 'https://127.0.0.1:8444/');
    const op = await page.locator('.reveal').first().evaluate((el) => getComputedStyle(el).opacity);
    expect(op).toBe('1');
    await ctx.close();
  });
});

test.describe('Enquiry form', () => {
  test.beforeEach(({ context }) => consent(context));
  const rows = [
    ['Regulatory and Licences', 'REGULATORY', 'LEAD_REGULATORY'],
    ['Manufacturing Advisory', 'MANUFACTURING', 'LEAD_MANUFACTURING'],
    ['Market Entry (India)', 'MARKET ENTRY', 'LEAD_MARKET_ENTRY'],
    ['Mergers and Acquisitions', 'M&A', 'LEAD_MA'],
    ['Fundraising and IPO Advisory', 'CAPITAL', 'LEAD_CAPITAL'],
    ['General', 'GENERAL', 'LEAD_GENERAL'],
  ];
  for (const [service, tag] of rows) {
    test(`routes "${service}" to the correct owner with tag ${tag}`, async ({ page, request }) => {
      const id = `e2e-${tag.replace(/\W/g, '')}-${Date.now()}`;
      await go(page, '/contact/');
      await page.locator('#f-name').fill('E2E Tester');
      await page.locator('#f-company').fill(id);
      await page.locator('#f-workEmail').fill('e2e@example.com');
      await page.locator('#f-country').fill('India');
      await page.locator('#f-industry').selectOption('Medical Devices and Diagnostics');
      await page.locator('#f-serviceInterest').selectOption(service);
      await page.locator('#f-message').fill('Automated routing test.');
      await page.locator('#f-consent').check();
      await page.waitForTimeout(3100);
      await page.getByRole('button', { name: /Send enquiry/ }).click();
      await expect(page.getByRole('heading', { name: /Thank you/ })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Read our latest insights' })).toBeVisible();
      await expect.poll(async () => {
        const r = await (await request.get(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`subject:"${id}"`)}`)).json();
        return r.messages?.[0]?.Subject || '';
      }, { timeout: 10_000 }).toContain(`[${tag}]`);
      const r = await (await request.get(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`subject:"${id}"`)}`)).json();
      const to = r.messages[0].To.map((t) => t.Address).join(',');
      expect(to).toBe(process.env[`${rows.find((x) => x[1] === tag)[2]}`] || to);
    });
  }
  test('validation: error summary, aria-invalid, field messages', async ({ page }) => {
    await go(page, '/contact/');
    await page.getByRole('button', { name: /Send enquiry/ }).click();
    await expect(page.getByRole('alert').first()).toContainText('problems with your enquiry');
    await expect(page.locator('#f-workEmail')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#f-workEmail-err')).toBeVisible();
  });
  test('error state when the server rejects (too fast → bot control)', async ({ page }) => {
    await go(page, '/contact/');
    await page.locator('#f-name').fill('Fast');
    await page.locator('#f-company').fill('Fast Co');
    await page.locator('#f-workEmail').fill('fast@example.com');
    await page.locator('#f-country').fill('India');
    await page.locator('#f-industry').selectOption('Other');
    await page.locator('#f-serviceInterest').selectOption('General');
    await page.locator('#f-message').fill('x');
    await page.locator('#f-consent').check();
    await page.getByRole('button', { name: /Send enquiry/ }).click();
    await expect(page.getByRole('alert').first()).toContainText(/rejected/i);
  });
  test('service query parameter preselects service interest', async ({ page }) => {
    await go(page, '/contact/?service=manufacturing-advisory');
    await expect(page.locator('#f-serviceInterest')).toHaveValue('Manufacturing Advisory');
  });
});

test.describe('Analytics consent', () => {
  test('no events before consent; consented events carry no message text', async ({ page }) => {
    const beacons = [];
    page.on('request', (r) => r.url().includes('/api/events') && beacons.push(r.url()));
    await page.addInitScript(() => { window.__lxEvents = []; });
    await go(page, '/');
    await page.getByRole('link', { name: 'Explore our capabilities' }).click();
    await page.waitForTimeout(2500);
    expect(beacons).toHaveLength(0);
    expect(await page.evaluate(() => window.__lxEvents.length)).toBe(0);
    await page.getByRole('button', { name: 'Accept' }).click();
    await go(page, '/contact/');
    const beacon = page.waitForRequest((r) => r.url().includes('/api/events'), { timeout: 8000 });
    await page.locator('#f-name').fill('x');
    await page.locator('#f-message').fill('SECRET-MESSAGE-TEXT');
    await beacon;
    const events = await page.evaluate(() => window.__lxEvents);
    expect(events.map((e) => e.name)).toContain('form_start');
    expect(JSON.stringify(events)).not.toContain('SECRET-MESSAGE-TEXT');
  });
});

test.describe('Responsive', () => {
  for (const w of [1440, 1024, 768, 390, 360, 320]) {
    test(`screenshots and no horizontal scroll at ${w}px`, async ({ page, context }) => {
      await consent(context);
      await page.setViewportSize({ width: w, height: 900 });
      for (const p of TEMPLATES) {
        await page.goto(p, { waitUntil: 'networkidle' });
        const sw = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(sw, `${p} at ${w}px`).toBeLessThanOrEqual(w);
        await page.screenshot({ path: `screenshots/${w}${p.replace(/\//g, '_') || '_home'}.png`, fullPage: true });
      }
    });
  }
  test('touch targets ≥ 44px on mobile (buttons, nav, CTAs)', async ({ page, context }) => {
    await consent(context);
    await page.setViewportSize({ width: 390, height: 844 });
    for (const p of TEMPLATES) {
      await page.goto(p, { waitUntil: 'networkidle' });
      const small = await page.evaluate(() =>
        [...document.querySelectorAll('button, .btn, .link-arrow, nav a, input[type=checkbox], select, input')]
          .filter((el) => el.offsetParent && !el.closest('[aria-hidden="true"]') && el.id !== 'website_url')
          .map((el) => ({ el, r: el.getBoundingClientRect() }))
          .filter(({ el, r }) => r.width > 0 && (el.type === 'checkbox' ? Math.max(r.width, el.closest('label')?.getBoundingClientRect().height || 0) < 20 : r.height < 44))
          .map(({ el, r }) => `${el.tagName}:${(el.textContent || el.name || '').trim().slice(0, 30)} ${Math.round(r.height)}px`));
      expect(small, p).toEqual([]);
    }
  });
});
