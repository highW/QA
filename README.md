# 🧪 Sal Rosa QA — Cypress Test Suite

End-to-end test suite for the [Sal Rosa Tampa](https://www.salrosatampa.com) restaurant website, built as a QA portfolio project. Tests run automatically on every push via GitHub Actions across multiple browsers and operating systems.

![Tests](https://img.shields.io/badge/tests-50%20passing-brightgreen)
![Cypress](https://img.shields.io/badge/cypress-v15-blue)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-black)
![Security](https://img.shields.io/badge/security-npm%20audit-success)
![Bugs](https://img.shields.io/badge/bugs%20filed-3-yellow)

---

## 📁 Project Structure

```
QA/
├── .github/
│   └── workflows/
│       └── test.cy.yml            # Security audit + cross-browser CI pipeline
├── cypress/
│   ├── e2e/
│   │   └── salrosa.cy.js          # 50 tests across 11 describe blocks
│   └── support/
│       ├── commands.js            # Custom reusable commands (shouldHaveValidUrl)
│       └── e2e.js                 # Support entry point + exception handler
├── src/
│   └── test.html                  # Saved copy of live restaurant site
├── cypress.config.js              # Cypress config with CDN blocking
├── package.json
├── TEST-PLAN.md                   # Full test plan with strategy & risk assessment
├── BUGS.md                        # Real bugs found and documented during QA
└── README.md
```

---

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

> **Note:** requires a local machine with a display. Does not work in headless CI environments.

### Run all tests headlessly

```bash
npm test
```

---

## ✅ Test Coverage — 50 Tests

| # | Describe Block | Tests | Priority | What's Covered |
|-|-|-|-|-|
| 1 | Page Load | 3 | P1 | Title, language attribute, successful render |
| 2 | Navigation | 6 | P2 | Menu, Happenings, Private Events, Marriott link, OpenTable button |
| 3 | Page Content | 4 | P2 | Latin cuisine copy, Tampa mentions, tagline, Cafe section |
| 4 | Contact & Footer | 6 | P2 | Address, phone, tel: link, footer, newsletter, Careers |
| 5 | Social Media Links | 6 | P2 | Instagram/Facebook/Twitter URL validation + target="_blank" |
| 6 | External Link Availability | 3 | P2 | Marriott, OpenTable, Careers reachability via cy.request() |
| 7 | Security | 4 | P2 | https-only links, no javascript: hrefs, no generator meta tag |
| 8 | Accessibility | 5 | P2 | h1, alt attributes, nav/footer landmarks, link text |
| 9 | Mobile Viewport | 4 | P2 | iPhone 14 render, phone link, footer, no horizontal overflow |
| 10 | Negative & Edge Cases | 3 | P3 | Fragment URL, JS-disabled degradation, anchor link format |
| 11 | **Reservation CTA** | **6** | **P1** | Button visibility, text, OpenTable ID, new tab, reachability, mobile |

---

## 🎯 Why Reservations Get Their Own Suite

The reservation button is the most business-critical element on this page. If it breaks, the restaurant stops taking bookings. A QA engineer's job isn't just to test what's technically interesting — it's to protect what matters most to the business.

Suite 11 tests the full reservation CTA lifecycle: visibility in the header, correct booking text, valid OpenTable restaurant ID in the URL, `target="_blank"` for new tab behavior, live reachability via `cy.request()`, and visibility on mobile (where the majority of restaurant searches happen).

---

## 🌐 Cross-Browser & Cross-OS Matrix

Tests run on **7 combinations** of OS and browser on every push:

| OS | Chrome | Firefox | Edge |
|-|-|-|-|
| Ubuntu (Linux) | ✅ | ✅ | — |
| macOS | ✅ | ✅ | — |
| Windows | ✅ | ✅ | ✅ |

Edge is Windows-only as it is not available on Linux/macOS GitHub runners.

---

## 🤖 GitHub Actions CI/CD

The workflow at `.github/workflows/test.cy.yml` triggers on every push and pull request to `main`.

### Pipeline Jobs

**Job 1 — Security Audit** (runs first)
- Runs `npm audit --audit-level=high`
- Fails the entire pipeline if any high or critical dependency vulnerabilities are found
- E2E tests don't run until the audit passes

**Job 2 — Cypress E2E Matrix** (runs after audit, across all 7 OS/browser combos)
1. Checks out repo on a fresh VM
2. Installs Node.js 20 with npm cache
3. Runs `npm ci` for reproducible installs
4. Boots the local server via `npm start`
5. Waits for `localhost:3000` to be ready
6. Runs all 50 Cypress tests
7. Uploads screenshots on failure (named by OS + browser, retained 7 days)

---

## 🐛 Bugs Found

Three real bugs were discovered and documented during this QA engagement. See [BUGS.md](./BUGS.md) for full reports.

| ID | Title | Severity | Status |
|-|-|-|-|
| BUG-001 | `target="_blank"` links missing `rel="noopener noreferrer"` | Medium | Open |
| BUG-002 | Reservation URL contains stale `datetime` from 2023 | Low | Open |
| BUG-003 | Missing `<meta name="description">` tag | Low | Open |

---

## 🗺️ Test Plan

See [TEST-PLAN.md](./TEST-PLAN.md) for the full test plan including:
- Scope & objectives
- Risk assessment table (what breaks = what priority)
- Why E2E only (no unit tests) for this project
- Social link testing strategy and rationale
- Entry/exit criteria
- Known limitations and accepted risks
- Future test ideas

---

## 🛠️ Technical Challenges Solved

**1. Page load timeout on saved Squarespace HTML**
CDN requests causing 60s timeouts in CI. Fixed with `blockHosts` to immediately reject external CDN requests.

**2. Unpredictable uncaught JS exceptions**
Blocking CDNs caused a flood of `ReferenceError` exceptions (jQuery, YUI, Squarespace runtime, cross-origin `Script error.`). For third-party HTML we don't control, the correct approach is to suppress all uncaught exceptions globally and rely on explicit assertions.

**3. Text selector mismatch**
`cy.contains()` matches visible DOM text only, not `alt` attributes. Fixed by targeting rendered paragraph content.

**4. Multiple element matches**
Marriott and OpenTable links appear 3 times (header, mobile nav, footer). Fixed with `.first()`.

**5. Social media links not testable via cy.request()**
Instagram/Facebook/Twitter/X return 403 for all automated requests. Fixed with custom `shouldHaveValidUrl` DOM validation command.

**6. opentable.com in blockHosts blocking cy.request()**
Removed from `blockHosts` so availability tests can reach it. Widget iframe failure doesn't affect assertions.

**7. Missing cypress:open script**
`"cypress:open": "cypress open"` was documented but not defined in `package.json`.

**8. Orphaned test1.cy.js outside e2e/ folder**
Spec outside the `specPattern` glob was never running. Removed.

---

## 💡 Key Cypress Concepts Demonstrated

* `blockHosts` to isolate tests from third-party CDN traffic
* `uncaught:exception` handler with documented reasoning
* `beforeEach` for consistent, isolated test setup
* `cy.viewport('iphone-14')` for mobile testing
* `cy.request()` with `failOnStatusCode: false` for link availability
* Custom chainable command (`shouldHaveValidUrl`) for DOM-based URL validation
* Attribute selectors: `a[href*="..."]`, `a[href^="http://"]`, `a[href^="tel:"]`
* `.first()` for duplicate element handling
* `.invoke('text')` and `.invoke('attr', 'href')` for value extraction
* Business-priority test planning (P1/P2/P3)
* Accessibility assertions: `alt`, landmarks, link text
* Security assertions: https-only, no `javascript:` hrefs
* `npm audit` as a CI quality gate
* Cross-browser/OS strategy matrix with `fail-fast: false`

---

## 📄 License

MIT