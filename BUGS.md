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

*Bug reports written following the standard QA format: Title, Severity, Priority, Environment, Steps to Reproduce, Actual Result, Expected Result, Evidence, Notes.*
*All bugs discovered on the live site `salrosatampa.com` and reproduced in the saved HTML snapshot used for automated testing.*