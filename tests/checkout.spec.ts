import { test } from '@playwright/test';

test('place order button can be clicked', async ({ page }) => {
  await page.setContent(`
    <h1>Checkout</h1>
    <button id="place-order" disabled>Place order</button>
  `);
  await page.getByRole('button', { name: 'Place order' }).click({ timeout: 5000 });
});