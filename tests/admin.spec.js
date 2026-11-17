import { test, expect } from '@playwright/test';

test('admin: sign in, dashboard, editor with live limits and SEO preview, styleguide (noindex)', async ({ page, request }) => {
  const res = await request.get('/admin/');
  expect(res.headers()['x-robots-tag']).toContain('noindex');
  await page.goto('/admin/');
  await page.getByLabel('Email').fill(process.env.ADMIN_EMAIL);
  await page.getByLabel('Password').fill(process.env.ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByText(/Content needing review/)).toBeVisible();
  await expect(page.getByText(/Verification required/)).toBeVisible();
  await page.getByRole('link', { name: 'Services', exact: true }).click();
  await page.getByRole('link', { name: /Strategy Consulting/ }).click();
  await expect(page.getByLabel(/^Headline/)).toHaveValue('Make the choices that create durable growth.');
  await page.getByLabel(/^Headline/).fill('one two three four five six seven eight nine ten eleven twelve thirteen');
  await expect(page.locator('label[for="headline"]')).toContainText('⚠ 13/12');
  await expect(page.getByLabel('Search result preview')).toContainText('Strategy Consulting');
  await page.goto('/admin/styleguide');
  await expect(page.getByRole('heading', { name: 'Styleguide' })).toBeVisible();
  expect(await page.locator('meta[name="robots"]').getAttribute('content')).toContain('noindex');
});
