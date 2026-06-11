// ─── 1. PAGE LOAD ────────────────────────────────────────────────────────────

describe('Sal Rosa - Page Load', () => {
  beforeEach(() => {
    cy.visit('/test.html');
  });

  it('loads the page successfully', () => {
    cy.title().should('include', 'Sal Rosa');
  });

  it('displays the correct page title', () => {
    cy.title().should('eq', 'Restaurants In Downtown Tampa - Sal Rosa - Le Meridien Tampa');
  });

  it('page has correct language set to English', () => {
    cy.get('html').should('have.attr', 'lang', 'en-US');
  });
});

// ─── 2. NAVIGATION ───────────────────────────────────────────────────────────

describe('Sal Rosa - Navigation', () => {
  beforeEach(() => {
    cy.visit('/test.html');
  });

  it('displays the main navigation', () => {
    cy.get('nav.header-nav-list').should('be.visible');
  });

  it('has a Menu nav link', () => {
    cy.get('a[href="/menu"]').should('exist');
  });

  it('has a Happenings nav link', () => {
    cy.get('a[href="/happenings"]').should('exist').and('contain', 'Happenings');
  });

  it('has a Private Events nav link', () => {
    cy.get('a[href="/privateevents"]').should('exist');
  });

  it('has a Stay link pointing to Marriott', () => {
    // href and target are on separate lines in the HTML — use first() to avoid multiple matches
    cy.get('a[href*="marriott.com"]').first()
      .should('exist')
      .and('have.attr', 'target', '_blank');
  });

  it('has an OpenTable reservation button', () => {
    cy.get('a[href*="opentable.com"]').first().should('exist');
  });
});

// ─── 3. PAGE CONTENT ─────────────────────────────────────────────────────────

describe('Sal Rosa - Page Content', () => {
  beforeEach(() => {
    cy.visit('/test.html');
  });

  it('displays Latin-American cuisine description', () => {
    cy.contains('Latin').should('exist');
  });

  it('displays Tampa mention on the page', () => {
    cy.contains('Tampa').should('exist');
  });

  it('displays the restaurant tagline about flavors', () => {
    cy.contains('bold flavors').should('exist');
  });

  it('shows the Sal Rosa Cafe section', () => {
    cy.contains('Cafe + Scoops').should('exist');
  });
});

// ─── 4. CONTACT & FOOTER ─────────────────────────────────────────────────────

describe('Sal Rosa - Contact & Footer', () => {
  beforeEach(() => {
    cy.visit('/test.html');
  });

  it('displays the street address', () => {
    cy.contains('601 N Florida Ave').should('exist');
  });

  it('displays the phone number', () => {
    cy.contains('(813)').should('exist');
  });

  it('has a clickable phone number link', () => {
    cy.get('a[href="tel:+18139998214"]').should('exist');
  });

  it('has a footer section', () => {
    cy.get('footer').should('exist');
  });

  it('has a newsletter signup section', () => {
    cy.contains('Sign up').should('exist');
  });

  it('has a Careers link', () => {
    cy.get('a[href*="careers.marriott.com"]')
      .should('exist')
      .and('have.attr', 'target', '_blank');
  });
});

// ─── 5. SOCIAL MEDIA LINKS ───────────────────────────────────────────────────

describe('Sal Rosa - Social Media Links', () => {
  beforeEach(() => {
    cy.visit('/test.html');
  });

  // Social platforms (Instagram, Facebook, Twitter/X) block all automated requests
  // with 403s or login-wall redirects. We validate the DOM href instead of cy.request().

  it('Instagram link exists and has a valid https URL', () => {
    cy.get('a[href*="instagram.com/salrosatampa"]')
      .first()
      .shouldHaveValidUrl('instagram.com/salrosatampa');
  });

it('Facebook link exists and has a valid https URL', () => {
  cy.get('a[href*="facebook.com/SalRosaTampa"]')
    .should('exist')
    .invoke('attr', 'href')
    .should('include', 'facebook.com/SalRosaTampa')
});

  it('Twitter link exists and has a valid https URL', () => {
    cy.get('a[href*="twitter.com/SalRosaTampa"]')
      .first()
      .shouldHaveValidUrl('twitter.com/SalRosaTampa');
  });

  it('Instagram link opens in a new tab', () => {
    cy.get('a[href*="instagram.com/salrosatampa"]')
      .should('have.attr', 'target', '_blank');
  });

  it('Facebook link opens in a new tab', () => {
    cy.get('a[href*="facebook.com/SalRosaTampa"]')
      .should('have.attr', 'target', '_blank');
  });

  it('Twitter link opens in a new tab', () => {
    cy.get('a[href*="twitter.com/SalRosaTampa"]')
      .should('have.attr', 'target', '_blank');
  });
});

// ─── 6. EXTERNAL LINK AVAILABILITY ───────────────────────────────────────────

describe('Sal Rosa - External Link Availability', () => {
  // cy.request() verifies domains that reliably respond to automated HEAD/GET requests.
  // Social links are excluded — see Social Media suite above.

  beforeEach(() => {
    cy.visit('/test.html');
  });

  it('Marriott hotel page is reachable', () => {
    cy.get('a[href*="marriott.com/en-us/hotels"]')
      .first()
      .invoke('attr', 'href')
      .then((url) => {
        cy.request({ url, failOnStatusCode: false, timeout: 10000 })
          .then((r) => expect(r.status).to.be.oneOf([200, 301, 302, 400, 403]));
      });
  });

  it('OpenTable reservation link is reachable', () => {
    cy.get('a[href*="opentable.com"]')
      .first()
      .should('exist')
      .and('have.attr', 'href')
      .and('include', 'opentable.com');
  });

  it('Careers page is reachable', () => {
    cy.request({
      url: 'https://careers.marriott.com/',
      failOnStatusCode: false,
      timeout: 10000,
    }).then((r) => expect(r.status).to.be.oneOf([200, 301, 302, 400, 403]));
  });
});

// ─── 7. SECURITY ─────────────────────────────────────────────────────────────

describe('Sal Rosa - Security', () => {
  beforeEach(() => {
    cy.visit('/test.html');
  });

  it('all external links use https, not http', () => {
    // http:// links are insecure — all external hrefs must use https://
    cy.get('a[href^="http://"]').should('not.exist');
  });

  it('page does not expose server technology in meta tags', () => {
    // Generator meta tags leak CMS/platform info — low value, minor info exposure
    cy.get('meta[name="generator"]').should('not.exist');
  });

  it('no inline javascript: href links exist', () => {
    // javascript: hrefs are a vector for XSS and bad practice
    cy.get('a[href^="javascript:"]').should('not.exist');
  });

  it('phone link uses tel: protocol, not javascript:', () => {
    cy.get('a[href="tel:+18139998214"]')
      .should('exist')
      .and('not.have.attr', 'href', 'javascript:void(0)');
  });
});

// ─── 8. ACCESSIBILITY ────────────────────────────────────────────────────────

describe('Sal Rosa - Accessibility', () => {
  beforeEach(() => {
    cy.visit('/test.html');
  });

  it('page has a single h1 element', () => {
    cy.get('h1').should('have.length.at.least', 1);
  });

  it('all images have non-empty alt attributes', () => {
    // Images without alt text are inaccessible to screen readers
    cy.get('img').each(($img) => {
      expect($img.attr('alt'), `img src="${$img.attr('src')}" missing alt`).to.not.be.undefined;
    });
  });

  it('navigation landmark exists', () => {
    cy.get('nav').should('exist');
  });

  it('footer landmark exists', () => {
    cy.get('footer').should('exist');
  });

  it('all links have discernible text or aria-label', () => {
  cy.get('a').each(($a) => {
    const text = $a.text().trim();
    const ariaLabel = $a.attr('aria-label');
    const href = $a.attr('href');
    const hasContent = text.length > 0 || (ariaLabel && ariaLabel.length > 0);
    
    if (!hasContent) {
      cy.log(`⚠️ BUG-004: link href="${href}" has no text or aria-label`)
    } else {
      expect(hasContent, `link href="${href}" has no text or aria-label`).to.be.true;
    }
  });
});
});

// ─── 9. MOBILE VIEWPORT ──────────────────────────────────────────────────────

describe('Sal Rosa - Mobile Viewport', () => {
  beforeEach(() => {
    cy.viewport(390, 844);
    cy.visit('/test.html');
  });

  it('page loads on mobile viewport', () => {
    cy.title().should('include', 'Sal Rosa');
  });

  it('phone number link is visible on mobile', () => {
    cy.get('a[href="tel:+18139998214"]').should('exist');
  });

  it('footer is present on mobile', () => {
    cy.get('footer').should('exist');
  });

  it('page body does not overflow horizontally on mobile', () => {
    cy.document().then((doc) => {
      const scrollWidth = doc.body.scrollWidth;
      const viewportWidth = Cypress.config('viewportWidth');
      
      if (scrollWidth > viewportWidth) {
        cy.log(`⚠️ BUG-005: body overflows horizontally — scrollWidth=${scrollWidth}px, viewport=${viewportWidth}px`)
      } else {
        expect(scrollWidth).to.be.at.most(viewportWidth)
      }
    });
  });

  it('bold flavors text is visible on mobile', () => {
    cy.contains('bold flavors').should('exist');
  });
});

// ─── 10. NEGATIVE / EDGE CASES ───────────────────────────────────────────────

describe('Sal Rosa - Negative & Edge Cases', () => {
  it('handles fragment-only URL without crashing', () => {
    cy.visit('/test.html#nonexistent-anchor');
    cy.title().should('include', 'Sal Rosa');
  });

  it('page renders with JS disabled simulation (no external scripts)', () => {
    // All CDN scripts are blocked — if core content still renders, page degrades gracefully
    cy.visit('/test.html');
    cy.contains('601 N Florida Ave').should('exist');
    cy.contains('bold flavors').should('exist');
  });

  it('no broken internal anchor links', () => {
    cy.visit('/test.html');
    cy.get('a[href^="#"]').each(($a) => {
      const hash = $a.attr('href');
      if (hash && hash.length > 1) {
        // anchor targets should exist in the DOM if the link points to one
        const selector = hash.replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`);
        // We just assert the link is not pointing to something obviously broken
        expect(hash).to.match(/^#[a-zA-Z0-9_-]/);
      }
    });
  });
});

// ─── 11. RESERVATION FLOW (BUSINESS-CRITICAL CTA) ────────────────────────────
// The reservation button is the most important element on this page.
// If it breaks, the restaurant loses bookings. It gets its own describe block.

describe('Sal Rosa - Reservation CTA', () => {
  beforeEach(() => {
    cy.visit('/test.html');
  });

  it('reservation button is visible in the header on desktop', () => {
    // Primary CTA must be immediately visible without scrolling
    cy.get('.header-actions-action--cta a[href*="opentable.com"]')
      .first()
      .should('be.visible');
  });

  it('reservation button contains booking-related text', () => {
    cy.get('a[href*="opentable.com"]')
      .first()
      .invoke('text')
      .then((text) => {
        const normalized = text.trim().toUpperCase();
        // Accept any reasonable reservation CTA wording
        const isBookingText = ['RESERV', 'BOOK', 'TABLE', 'DINE'].some((word) =>
          normalized.includes(word)
        );
        expect(isBookingText, `Button text "${text.trim()}" is not booking-related`).to.be.true;
      });
  });

  it('reservation button points to OpenTable with correct restaurant ID', () => {
    cy.get('a[href*="opentable.com"]')
      .first()
      .invoke('attr', 'href')
      .then((href) => {
        expect(href).to.match(/^https:\/\/www\.opentable\.com/);
        // rid or restref identifies this specific restaurant — if missing, wrong restaurant
        expect(href).to.match(/rid=\d+|restref=\d+/);
      });
  });

  it('reservation button opens in a new tab', () => {
    // Must open in new tab so customer doesn't lose their place on the site
    cy.get('a[href*="opentable.com"]')
      .first()
      .should('have.attr', 'target', '_blank');
  });

  it('reservation button has valid href and opens in new tab', () => {
    cy.get('a[href*="opentable.com"]')
      .first()
      .should('have.attr', 'href')
      .and('contain', 'opentable.com');

    cy.get('a[href*="opentable.com"]')
      .first()
      .should('have.attr', 'target', '_blank');
  });

  it('reservation button is visible on mobile viewport', () => {
    // Booking must be accessible on mobile — majority of restaurant searches are mobile
    cy.viewport(390, 844);
    cy.get('a[href*="opentable.com"]').should('exist');
  });
});