import { expect, test } from '@playwright/test';

test('home renders the header, hero and footer', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Effortless cooling at your doorstep',
  );
  await expect(page.getByRole('link', { name: 'ColdEasy home' })).toBeVisible();
  await expect(page.locator('footer')).toContainText('Effortless Cooling, Everyday.');
  // WhatsApp is reachable from every screen (docs/04 §7 rule 3).
  await expect(page.locator('header a[href^="https://wa.me/919182968542"]')).toBeVisible();
});

test('dark home theme is on outside production (docs/11 A5)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-theme="dark"]').first()).toBeVisible();
  const bg = await page
    .locator('main')
    .evaluate((el) => getComputedStyle(el.parentElement!).backgroundColor);
  expect(bg).toBe('rgb(37, 26, 16)');
});

test('no white gradient at the bottom of the home page', async ({ page }) => {
  await page.goto('/');
  const gradients = await page.evaluate(
    () =>
      [...document.querySelectorAll('main *')].filter((el) =>
        getComputedStyle(el).backgroundImage.includes('gradient'),
      ).length,
  );
  expect(gradients).toBe(0);
});

test('signup is optional, consent is unticked and validated', async ({ page }) => {
  await page.goto('/science');
  await page.getByRole('button', { name: 'Sign up' }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Get ColdEasy updates on WhatsApp' });
  await expect(dialog).toBeVisible();
  const consent = dialog.getByRole('checkbox');
  await expect(consent).not.toBeChecked();
  await dialog.getByRole('button', { name: 'Sign up' }).click();
  await expect(dialog.getByText('Enter a 10-digit mobile number')).toBeVisible();
  await dialog.getByLabel('Mobile number').fill('9999900001');
  await consent.check();
  await dialog.getByRole('button', { name: 'Sign up' }).click();
  await expect(dialog.getByRole('status')).toContainText('not switched on yet');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('mobile menu opens and closes', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.locator('#mobile-menu');
  await expect(menu.getByRole('link', { name: 'Science' })).toBeVisible();
  await menu.getByRole('button', { name: 'Close menu' }).click();
  await expect(menu).toBeHidden();
});

test('tomato time-lapse is labelled illustrative and has no day counter', async ({ page }) => {
  await page.goto('/science');
  await expect(page.getByText('Illustrative', { exact: true })).toBeVisible();
  await expect(page.getByText(/Day \d+ of \d+/)).toHaveCount(0);
});

test('branded 404 with a way back', async ({ page }) => {
  const res = await page.goto('/this-page-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("We couldn't find that page");
  await expect(page.getByRole('link', { name: 'Go to home' })).toBeVisible();
});

test('security headers and noindex outside production', async ({ request }) => {
  const res = await request.get('/');
  const h = res.headers();
  expect(h['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['x-frame-options']).toBe('DENY');
  expect(h['x-robots-tag']).toContain('noindex');
});

test('/en/... redirects to the root English URL', async ({ request }) => {
  const res = await request.get('/en/science', { maxRedirects: 0 });
  expect(res.status()).toBe(308);
  expect(res.headers()['location']).toMatch(/\/science$/);
});
