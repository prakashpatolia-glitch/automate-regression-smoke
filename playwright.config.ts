import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // Fail the build if a test.only is left in the code.
  forbidOnly: !!process.env.CI,
  // One retry in CI so a single network blip does not turn the run red.
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  // The HTML report is what you screenshot. "never" stops it from opening a browser by itself.
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://playwright.dev',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
