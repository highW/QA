# 🗺️ Test Plan — Sal Rosa Tampa Website

**Project:** Sal Rosa QA — Cypress Test Suite
**Site under test:** https://www.salrosatampa.com
**Test environment:** Saved HTML snapshot (`src/test.html`) served locally on `localhost:3000`
**Author:** QA Engineer
**Last updated:** May 2026

---

## 1. Scope & Objectives

This test plan covers end-to-end quality assurance for the Sal Rosa Tampa restaurant homepage. The primary objective is to ensure the site correctly serves its core business function: **converting visitors into diners**.

### In Scope
- Page load and rendering
- Navigation and internal links
- Core content accuracy (address, phone, taglines)
- **Reservation CTA** — highest priority; directly affects revenue
- Social media links
- External link availability
- Security posture
- Accessibility compliance
- Mobile responsiveness
- Negative and edge cases

### Out of Scope
- Backend systems (Squarespace CMS internals)
- Payment processing
- OpenTable booking form completion (third-party)
- Performance load testing

---

## 2. Risk Assessment

| Feature | Business Risk | Test Priority |
|---|---|---|
| Reservation button (OpenTable) | 🔴 Critical — broken = lost bookings | P1 |
| Phone number link (`tel:`) | 🔴 High — customers can't call | P1 |
| Page load | 🔴 High — nothing works if page doesn't load | P1 |
| Navigation links | 🟡 Medium — broken nav hurts UX | P2 |
| Social media links | 🟡 Medium — brand visibility | P2 |
| Security (https, XSS) | 🟡 Medium — trust & compliance | P2 |
| Accessibility | 🟡 Medium — legal risk (ADA), wider audience | P2 |
| Mobile viewport | 🟡 Medium — majority of restaurant searches are mobile | P2 |
| Footer / Careers | 🟢 Low — supplementary content | P3 |
| Edge cases | 🟢 Low — rare but good to catch | P3 |

---

## 3. Test Strategy

### Why E2E Only (No Unit Tests)

This is a **saved HTML snapshot** of a Squarespace-generated site. There is no application logic, no backend, and no components to unit test. E2E tests via Cypress are the only appropriate strategy — they simulate what a real user experiences in a browser.

### Why a Local Snapshot Instead of Live URL

Testing against a live Squarespace URL introduces:
- **Flakiness** from external CDN availability
- **Non-determinism** if site content changes between runs
- **Rate limiting** from the hosting platform

The saved snapshot gives deterministic, reproducible results in CI.

### Handling Third-Party Scripts

Squarespace loads dozens of external scripts (jQuery, YUI, analytics, widget runners) from CDNs. In CI, these CDNs are unreachable, causing a flood of `uncaught:exception` errors that would fail every test.

**Decision:** Use `blockHosts` in `cypress.config.js` to immediately reject CDN requests, and suppress all uncaught exceptions globally with a documented comment. Our explicit DOM assertions are the correctness guarantee — not the absence of JS errors.

### Social Link Testing Strategy

Instagram, Facebook, and Twitter/X block all automated HTTP requests (return 403 or redirect to login). `cy.request()` on these URLs will always fail regardless of whether the link is valid.

**Decision:** Validate social links via DOM inspection (`shouldHaveValidUrl` custom command) — asserting the `href` exists, uses `https://`, and points to the correct domain. This is the meaningful, reliable check available for third-party social links.

---

## 4. Test Environment

| Item | Value |
|---|---|
| Local server | `npx serve src -p 3000` |
| Base URL | `http://localhost:3000` |
| Browsers (CI) | Chrome, Firefox, Edge |
| OS (CI) | Ubuntu, macOS, Windows |
| Node.js version | 20 |
| Cypress version | 15.x |
| Viewport (desktop) | 1280 × 720 |
| Viewport (mobile) | iPhone 14 (390 × 844) |

---

## 5. Test Cases Summary

| # | Suite | Tests | Priority |
|---|---|---|---|
| 1 | Page Load | 3 | P1 |
| 2 | Navigation | 6 | P2 |
| 3 | Page Content | 4 | P2 |
| 4 | Contact & Footer | 6 | P2 |
| 5 | Social Media Links | 6 | P2 |
| 6 | External Link Availability | 3 | P2 |
| 7 | Security | 4 | P2 |
| 8 | Accessibility | 5 | P2 |
| 9 | Mobile Viewport | 4 | P2 |
| 10 | Negative & Edge Cases | 3 | P3 |
| 11 | **Reservation CTA** | **6** | **P1** |
| | **Total** | **50** | |

---

## 6. Entry & Exit Criteria

### Entry Criteria (before testing begins)
- Local server starts successfully on `localhost:3000`
- `npm ci` completes without errors
- `npm audit` returns zero high/critical vulnerabilities

### Exit Criteria (testing complete when)
- All 50 tests pass across all 7 OS/browser combinations in CI
- Zero high/critical npm vulnerabilities
- Screenshots artifact uploaded for any failures

---

## 7. Known Limitations & Accepted Risks

| Limitation | Reason | Accepted? |
|---|---|---|
| Social links validated by DOM only, not HTTP | Social platforms block automated requests | ✅ Yes — DOM validation is sufficient signal |
| `uncaught:exception` globally suppressed | Third-party CDN scripts produce unpredictable errors we don't own | ✅ Yes — documented, relying on assertions |
| OpenTable form completion not tested | Completing a real reservation would affect live restaurant data | ✅ Yes — link reachability is sufficient |
| Snapshot may drift from live site | Site updates won't auto-update the snapshot | ⚠️ Accepted risk — snapshot should be refreshed periodically |

---

## 8. Out of Scope — Future Test Ideas

- **Visual regression testing** (e.g., Percy, Chromatic) — catch layout changes
- **Performance budget** — assert page load under X seconds
- **axe-core accessibility audit** — programmatic WCAG compliance scan
- **Live URL smoke test** — quick sanity check against production after deploys
- **Menu page tests** — `/menu` route content and structure