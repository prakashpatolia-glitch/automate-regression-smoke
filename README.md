# playwright-regression-demo

A small public demo that goes with the LintQA article on what to automate first in regression testing.

It tests the public Playwright website, so there is no private project involved. Two tests are tagged `@smoke`, and every test is tagged `@regression`.

## Versions

- Playwright 1.64.1 (`@playwright/test`)
- Node.js 20 or newer

## Run it locally.

```bash
npm install
npx playwright install chromium
npm run smoke          # 2 smoke tests, Chromium only
npm run report         # opens the HTML report
```

To run the full regression set on all three browsers:

```bash
npx playwright install
npm run regression
```

## CI

- `.github/workflows/pr-gate.yml` runs the smoke tests on Chromium for every pull request.
- `.github/workflows/nightly-regression.yml` runs the full `@regression` set on Chromium, Firefox and WebKit every night, and can be started by hand from the Actions tab.
