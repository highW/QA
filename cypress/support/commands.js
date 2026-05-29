// Custom reusable Cypress commands

Cypress.Commands.add('fillContactForm', ({ name, email, message }) => {
  cy.get('[data-cy="input-name"]').clear().type(name);
  cy.get('[data-cy="input-email"]').clear().type(email);
  cy.get('[data-cy="input-message"]').clear().type(message);
  cy.get('[data-cy="btn-submit"]').click();
});
Cypress.Commands.add('shouldHaveValidUrl', { prevSubject: 'element'}, (subject, expectedDomain) =>{
  cy.wrap(subject)
  .invoke('attr', 'href')
  .then((href) => {
    expect(href, 'href should exist').to.exist;
    expect(href, 'href should use https').to.match(/^https:\/\//);
    expect(href, 'href should point to ${expectedDomain}'.to.include(expectedDomain));
  });
});