# 🧪 Sal Rosa QA — Cypress Test Suite

End-to-end test suite for the [Sal Rosa Tampa](https://www.salrosatampa.com) restaurant website, built as a QA portfolio project. Tests run automatically on every push via GitHub Actions across multiple browsers and operating systems.

![Tests](https://img.shields.io/badge/tests-25%20passing-brightgreen)
![Cypress](https://img.shields.io/badge/cypress-v15-blue)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-black)

\---

## 📁 Project Structure

```
QA/
├── .github/
│   └── workflows/
│       └── cypress.yml         # Cross-browser CI pipeline
├── cypress/
│   ├── e2e/
│   │   └── salrosa.cy.js       # 31 tests across 6 describe blocks
│   └── support/
│       ├── commands.js         # Custom reusable commands
│       └── e2e.js              # Support entry point
├── src/
│   └── test.html               # Saved copy of live restaurant site
├── cypress.config.js           # Cypress config with CDN blocking
├── package.json
└── README.md
```

\---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) v18 or higher
* npm (comes with Node.js)

### Install dependencies

```bash
npm install
```

### Start the local server

```bash
npm start
```

Serves `src/test.html` on `http://localhost:3000`.

### Open Cypress Test Runner (interactive)

```bash
npm run cypress:open
```

### Run all tests headlessly

```bash
npm test
```

\---

## ✅ Test Coverage — 31 Tests

|Describe Block|Tests|What's Covered|
|-|-|-|
|Page Load|3|Title, language attribute, successful render|
|Navigation|6|Menu, Happenings, Private Events, Marriott link, OpenTable button|
|Page Content|4|Latin cuisine copy, Tampa mentions, tagline, Cafe section|
|Contact \& Footer|6|Address, phone number, tel: link, footer, newsletter, Careers|
| External Link Availability | 6 | Social URL format validation, Marriott/OpenTable/Careers reachability via cy.request() |
|Social Media|6|Instagram, Facebook, Twitter links + target="\_blank" on each|

\---

## 🌐 Cross-Browser \& Cross-OS Matrix

Tests run on **7 combinations** of OS and browser on every push:

|OS|Chrome|Firefox|Edge|
|-|-|-|-|
|Ubuntu (Linux)|✅|✅|—|
|macOS|✅|✅|—|
|Windows|✅|✅|✅|

Edge is Windows-only as it is not available on Linux/macOS GitHub runners.

\---

## 🤖 GitHub Actions CI/CD

The workflow at `.github/workflows/cypress.yml` triggers on every push and pull request to `main`.

**Pipeline steps (per matrix job):**

1. Checks out repo on a fresh VM (Ubuntu / macOS / Windows)
2. Installs Node.js 20 with npm cache for speed
3. Runs `npm ci` for clean, reproducible installs
4. Boots the local server via `npm start`
5. Waits for `localhost:3000` to be ready
6. Runs all 31 Cypress tests in the specified browser
7. Uploads screenshots as artifacts on failure (named by OS + browser)

**Every commit shows a pass/fail status** per OS/browser combination directly in GitHub.

\---

## 🛠️ Technical Challenges Solved

Real problems encountered and fixed during this project:

**1. Page load timeout on saved Squarespace HTML**
Squarespace pages load dozens of scripts from external CDNs. GitHub's CI runner has no access to those, causing 60s timeouts. Fixed by adding `blockHosts` in `cypress.config.js` to immediately reject external CDN requests rather than waiting for them.

**2. jQuery `$ is not defined` crash**
Blocking the CDN also blocked jQuery, causing the page's own JavaScript to throw uncaught errors and fail every test. Fixed by adding `Cypress.on('uncaught:exception', () => false)` in `e2e.js` — the standard approach for testing third-party sites where you don't control the JS.

**3. Text selector mismatch**
`cy.contains()` only matches visible DOM text, not `alt` attributes. An image had `alt="Sal Rosa Cafe + Scoops"` but the visible paragraph text was different. Fixed by targeting the actual rendered paragraph content.

**4. Multiple element matches**
Marriott and OpenTable links appear 3 times in the HTML (header, mobile nav, footer). Fixed with `.first()` to avoid Cypress throwing on multiple matches.

**5. Social media links not testable via cy.request()**
Instagram, Facebook, and Twitter/X return `403` or redirect to login pages for all automated/non-browser requests. Attempting `cy.request()` on these URLs will always fail in CI regardless of whether the link is valid. Fixed by using a custom `shouldHaveValidUrl` command that reads the `href` from the DOM and validates it is a well-formed `https://` URL pointing to the correct domain — the meaningful, reliable check available for third-party social links.

**6. opentable.com blocked by blockHosts**
`opentable.com` was in the `blockHosts` list to prevent the page from loading the OpenTable widget. This also inadvertently blocked `cy.request()` from reaching OpenTable for availability testing. Fixed by removing `opentable.com` from `blockHosts` — the widget iframe failing to load doesn't affect any test assertions.

**7. Missing `cypress:open` script**
The README documented `npm run cypress:open` but the script was never defined in `package.json`, making the interactive test runner inaccessible. Fixed by adding `"cypress:open": "cypress open"` to the scripts.

---

## 💡 Key Cypress Concepts Demonstrated

* `blockHosts` to handle third-party CDN dependencies in CI
* `uncaught:exception` handler for legacy/third-party JavaScript
* `beforeEach` hooks for consistent test setup
* Attribute selectors: `a[href*="..."]`, `a[href^="tel:"]`
* `.first()` to handle duplicate elements
* `should('have.attr', 'target', '_blank')` for link safety checks
* `cy.request()` with `failOnStatusCode: false` for external link availability
* Custom chainable command (`shouldHaveValidUrl`) for DOM-based URL validation
* Strategy matrix in GitHub Actions for cross-browser/OS coverage
* `fail-fast: false` to get full results across all matrix jobs

\---

## 📄 License

MIT

