describe('Web Page QA Test', () => {
  it('should load the front page and check name', () => {
    cy.visit('test.html.html'); // local file or hosted URL
    cy.contains('Start page').should('be.visible');
  });

  it('should have a contact link', () => {
    cy.get('a[href^="mailto:"]').should('exist');
  });
});
