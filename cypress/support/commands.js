// Custom reusable Cypress commands

Cypress.Commands.add('fillContactForm', ({ name, email, message }) => {
  cy.get('[data-cy="input-name"]').clear().type(name);
  cy.get('[data-cy="input-email"]').clear().type(email);
  cy.get('[data-cy="input-message"]').clear().type(message);
  cy.get('[data-cy="btn-submit"]').click();
});