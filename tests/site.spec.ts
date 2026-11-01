import { test, expect } from '@playwright/test';

// Everything in this describe block carries @regression.
// The two smoke tests carry @smoke on top, so they belong to both sets.
test.describe('Playwright site', { tag: '@regression' }, () => {
  test('home page has the Playwright title', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('Get started link opens the installation page', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  });

  // Wider checks: the kind of stable, high-traffic pages that belong in wave 3.
  const docPages = [
    '/docs/intro',
    '/docs/writing-tests',
    '/docs/locators',
    '/docs/test-assertions',
    '/docs/running-tests',
    '/docs/ci-intro',
    '/docs/trace-viewer-intro',
    '/docs/api/class-page',
  ];

  for (const path of docPages) {
    test(`${path} loads and keeps the Playwright title`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.ok()).toBeTruthy();
      await expect(page).toHaveTitle(/Playwright/);
    });
  }
});
