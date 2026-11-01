import { test, expect, type Page } from '@playwright/test';

// A tiny stand-in checkout page, served by page.route, so this file runs on any machine.
// Nothing here touches a real shop or a real payment service.
const checkoutHtml = `<!doctype html>
<html><head><title>Checkout</title></head>
<body>
  <h1>Checkout</h1>
  <button id="pay">Pay now</button>
  <div id="result"></div>
  <script>
    document.getElementById('pay').addEventListener('click', async () => {
      const result = document.getElementById('result');
      try {
        const res = await fetch('/api/payments', { method: 'POST' });
        if (!res.ok) throw new Error('payment failed');
        result.innerHTML = '<h2>Order confirmed</h2>';
      } catch (e) {
        result.innerHTML = '<p role="alert">Payment failed, please try again.</p>';
      }
    });
  </script>
</body></html>`;

async function serveCheckoutPage(page: Page) {
  await page.route('**/checkout', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: checkoutHtml })
  );
}

test.describe('Checkout', { tag: '@regression' }, () => {
  test('card payment succeeds', { tag: '@smoke' }, async ({ page }) => {
    await serveCheckoutPage(page);
    await page.route('**/api/payments', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'paid' }),
      })
    );
    await page.goto('/checkout');
    await page.getByRole('button', { name: 'Pay now' }).click();
    await expect(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible();
  });

  test('shows a retry message when the payment API returns 500', async ({ page }) => {
    await serveCheckoutPage(page);
    await page.route('**/api/payments', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Payment service unavailable' }),
      })
    );
    await page.goto('/checkout');
    await page.getByRole('button', { name: 'Pay now' }).click();
    await expect(page.getByRole('alert')).toContainText('try again');
  });
});