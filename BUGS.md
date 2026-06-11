# 🐛 Bug Reports — Sal Rosa Tampa Website

This document contains real bugs discovered during manual and automated QA of the Sal Rosa Tampa restaurant website. Written using the standard bug report format to demonstrate full QA workflow — not just test automation.

---

## BUG-001 — Reservation Button Missing `rel="noopener noreferrer"` on `target="_blank"` Links

**Status:** Open
**Severity:** Medium
**Priority:** P2
**Environment:** All browsers, all OS — reproducible 100% of the time
**Discovered:** Manual code review + automated security suite

---

**Steps to Reproduce:**
1. Open `https://www.salrosatampa.com` in any browser
2. Right-click the **RESERVATIONS** button in the header
3. Select **Inspect Element**
4. Observe the anchor tag attributes

**Actual Result:**
The reservation button and all external `target="_blank"` links (social media, Marriott, Careers) are missing the `rel="noopener noreferrer"` attribute:
```html
<a href="https://www.opentable.com/..." target="_blank">RESERVATIONS</a>
```

**Expected Result:**
All links that open in a new tab should include `rel="noopener noreferrer"` to prevent reverse tabnapping attacks:
```html
<a href="https://www.opentable.com/..." target="_blank" rel="noopener noreferrer">RESERVATIONS</a>
```

**Security Impact:**
Without `rel="noopener"`, the opened page (`opentable.com`) gains access to `window.opener` and can redirect the original Sal Rosa tab to a malicious URL — a technique known as **reverse tabnapping**. This is a low-effort attack that can be used for phishing.

**Notes:**
- This is a Squarespace platform limitation — the CMS generates these links without `rel` attributes
- Mitigation requires either a Squarespace platform update or custom CSS injection
- OWASP recommends `rel="noopener noreferrer"` on all `target="_blank"` links
- Reference: https://owasp.org/www-community/attacks/Reverse_Tabnabbing

---

## BUG-002 — OpenTable Reservation Link Contains Stale `datetime` Parameter

**Status:** Open
**Severity:** Low
**Priority:** P3
**Environment:** All browsers — reproducible 100% of the time
**Discovered:** Manual inspection of reservation button `href`

---

**Steps to Reproduce:**
1. Open `https://www.salrosatampa.com`
2. Hover over or inspect the **RESERVATIONS** button
3. Observe the full URL in the `href` attribute

**Actual Result:**
The OpenTable URL contains a hardcoded `datetime` parameter from 2023:
```
datetime=2023-08-11T20%3A30
```

**Expected Result:**
The `datetime` parameter should either be dynamically generated based on the current date/time, or omitted so OpenTable uses its default (today's date):
```
https://www.opentable.com/restref/client/?rid=147973
```

**User Impact:**
When a visitor clicks RESERVATIONS, OpenTable may pre-populate a reservation date from 2023. The user must manually correct the date before completing their booking — this creates unnecessary friction in the conversion flow and may cause some users to abandon the reservation.

**Notes:**
- The restaurant still functions correctly since OpenTable handles the stale date gracefully
- Fix requires updating the Squarespace OpenTable widget configuration to remove or dynamically set the `datetime` parameter
- Severity is Low because OpenTable auto-corrects the date on its side — this is UX friction, not a broken flow

---

## BUG-003 — Page Has No `<meta name="description">` Tag

**Status:** Open
**Severity:** Low
**Priority:** P3
**Environment:** All browsers — reproducible 100% of the time
**Discovered:** Manual code review / SEO audit

---

**Steps to Reproduce:**
1. Open browser DevTools on `https://www.salrosatampa.com`
2. Go to **Elements** tab
3. Search for `meta name="description"` in the `<head>`

**Actual Result:**
No `<meta name="description">` tag is present in the page `<head>`. Search engines and social media platforms will use auto-generated descriptions, which may not accurately represent the restaurant.

**Expected Result:**
```html
<meta name="description" content="Sal Rosa is a Latin American and Caribbean restaurant located in the Le Méridien Tampa hotel. Bold flavors, house-made ice cream, and Illy coffee in Downtown Tampa.">
```

**Impact:**
- Reduced click-through rate from search engine results (Google uses the description in search snippets)
- Social media shares (Facebook, Twitter) will show auto-generated previews instead of a curated message
- This is a missed marketing opportunity rather than a functional defect

**Notes:**
- The page does have `twitter:description` and Open Graph meta tags, so social sharing works
- The missing standard `<meta name="description">` primarily affects organic search
- Fix is straightforward — add one line to the Squarespace SEO settings

---

## BUG-004 — Home Link Missing Accessible Text or `aria-label`

**Status:** Open
**Severity:** Medium
**Priority:** P2
**Environment:** All browsers — reproducible 100% of the time
**Discovered:** Automated accessibility suite (Cypress)

---

**Steps to Reproduce:**
1. Open `https://www.salrosatampa.com`
2. Inspect the logo/home link in the header
3. Observe the anchor tag

**Actual Result:**
A link with `href="/"` has no text content and no `aria-label` attribute:
```html
<a href="/"></a>
```

**Expected Result:**
```html
<a href="/" aria-label="Sal Rosa Home"></a>
```

**Impact:**
Screen readers cannot identify the purpose of this link — violates WCAG 2.4.4 Link Purpose (Level A). Users with visual impairments cannot navigate effectively.

**Notes:**
- Discovered by automated Cypress accessibility test
- Fix requires adding `aria-label` to the link in Squarespace

---

## BUG-005 — Page Body Overflows Horizontally on Mobile Viewport

**Status:** Open
**Severity:** Medium
**Priority:** P2
**Environment:** Mobile viewport (390x844) — reproducible 100% of the time
**Discovered:** Automated Cypress mobile viewport suite

---

**Steps to Reproduce:**
1. Open `https://www.salrosatampa.com` on a mobile device or browser DevTools
2. Set viewport to 390x844 (iPhone 14) or any narrow mobile width
3. Observe horizontal scrollbar presence
4. Inspect `document.body.scrollWidth`

**Actual Result:**
`document.body.scrollWidth` returns **8978px** on a 364px viewport — the page
body is 24x wider than the visible screen area, causing severe horizontal overflow.

**Expected Result:**
`document.body.scrollWidth` should be less than or equal to the viewport width (364px).
No horizontal scrollbar should be present on mobile.

**User Impact:**
- Mobile users experience unwanted horizontal scrolling
- Page layout is broken on small screens
- Content may be cut off or misaligned
- Negatively impacts mobile UX and SEO (Google penalizes non-mobile-friendly pages)
- Likely caused by a fixed-width element, non-responsive image, or missing `overflow-x: hidden` on the body

**Expected Fix:**
Identify the element causing overflow using:
```css
* { outline: 1px solid red; }
```
Or Chrome DevTools → Rendering → Layout Shift Regions.
Likely candidates: fixed-width containers, wide images, or third-party widgets without responsive constraints.

**Notes:**
- The Squarespace CMS may be injecting fixed-width elements
- Adding `overflow-x: hidden` to `body` in custom CSS is a quick mitigation
- Full fix requires identifying and correcting the overflowing element
- WCAG 1.4.10 Reflow requires content to be accessible at 320px width without horizontal scrolling
- Reference: https://www.w3.org/WAI/WCAG21/Understanding/reflow.html


*Bug reports written following the standard QA format: Title, Severity, Priority, Environment, Steps to Reproduce, Actual Result, Expected Result, Evidence, Notes.*
*All bugs discovered on the live site `salrosatampa.com` and reproduced in the saved HTML snapshot used for automated testing.*