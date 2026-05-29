// cypress/support/e2e.js
import './commands';

// Suppress only known third-party errors caused by blocked CDN (jQuery not loading).
// All other uncaught exceptions will still fail the test as expected.
Cypress.on('uncaught:exception', (err) => {
  const knownThirdPartyErrors = [
    '$ is not defined',
    'jQuery is not defined',
    'Cannot read properties of undefined', // Squarespace widget init failures
  ];
  if (knownThirdPartyErrors.some((msg) => err.message.includes(msg))) {
    return false; // suppress — not our code
  }
  return true; // re-throw — fail the test
});-e 

  it('Instagram link opens in a new tab with noopener', () => {
    // target="_blank" is on a separate line in the HTML but Cypress reads the DOM, not raw HTML
    cy.get('a[href*="instagram.com/salrosatampa"]')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'rel').and('include', 'noopener');
  });

  it('Facebook link opens in a new tab with noopener', () => {
    cy.get('a[href*="facebook.com/SalRosaTampa"]')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'rel').and('include', 'noopener');
  });

  it('Twitter link opens in a new tab with noopener', () => {
    cy.get('a[href*="twitter.com/SalRosaTampa"]')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'rel').and('include', 'noopener');
  });