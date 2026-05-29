// cypress/e2e/salrosa.cy.js
// Tests for the Sal Rosa Tampa restaurant homepage (test.html)

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
    // href and target are on separate lines in the HTML - use first() to avoid multiple matches
    cy.get('a[href*="marriott.com"]').first()
      .should('exist')
      .and('have.attr', 'target', '_blank');
  });

  it('has an OpenTable reservation button', () => {
    cy.get('a[href*="opentable.com"]').first().should('exist');
  });
});

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

describe('Sal Rosa - External Link Availability', () => {
  // cy.request() checks that external URLs are reachable (return 2xx or 3xx).
  // This catches dead links without opening a new browser tab.
  // failOnStatusCode: false lets us assert manually for clearer error messages.

  const externalLinks = [
    { name: 'Instagram',  url: 'https://www.instagram.com/salrosatampa' },
    { name: 'Facebook',   url: 'https://www.facebook.com/SalRosaTampa/' },
    { name: 'Twitter',    url: 'https://twitter.com/SalRosaTampa' },
    { name: 'OpenTable',  url: 'https://www.opentable.com/restref/client/?rid=57536' },
    { name: 'Marriott',   url: 'https://www.marriott.com/en-us/hotels/tpalf-le-meridien-tampa/overview/' },
    { name: 'Careers',    url: 'https://careers.marriott.com' },
  ];

  externalLinks.forEach(({ name, url }) => {
    it(`${name} link is reachable`, () => {
      cy.request({
        url,
        failOnStatusCode: false,
        timeout: 10000,
      }).then((response) => {
        expect(response.status, `${name} returned unexpected status`).to.be.lessThan(400);
      });
    });
  });
});

describe('Sal Rosa - Social Media Links', () => {
  beforeEach(() => {
    cy.visit('/test.html');
  });

  it('has an Instagram link', () => {
    // Use href* (contains) to handle trailing slashes
    cy.get('a[href*="instagram.com/salrosatampa"]').should('exist');
  });

  it('has a Facebook link', () => {
    cy.get('a[href*="facebook.com/SalRosaTampa"]').should('exist');
  });

  it('has a Twitter link', () => {
    cy.get('a[href*="twitter.com/SalRosaTampa"]').should('exist');
  });

  it('Instagram link opens in a new tab', () => {
    // target="_blank" is on a separate line in the HTML but Cypress reads the DOM, not raw HTML
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