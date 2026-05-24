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
    cy.get('a[href*="marriott.com"]')
      .should('exist')
      .and('have.attr', 'target', '_blank');
  });

  it('has an OpenTable reservation button', () => {
    cy.get('a[href*="opentable.com"]').should('exist');
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
    cy.contains('Sal Rosa Cafe').should('exist');
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

describe('Sal Rosa - Social Media Links', () => {
  beforeEach(() => {
    cy.visit('/test.html');
  });

  it('has an Instagram link', () => {
    cy.get('a[href*="instagram.com/salrosatampa"]').should('exist');
  });

  it('has a Facebook link', () => {
    cy.get('a[href*="facebook.com/SalRosaTampa"]').should('exist');
  });

  it('has a Twitter link', () => {
    cy.get('a[href*="twitter.com/SalRosaTampa"]').should('exist');
  });

  it('social links open in a new tab', () => {
    cy.get('a[href*="instagram.com/salrosatampa"]')
      .should('have.attr', 'target', '_blank');
  });
});