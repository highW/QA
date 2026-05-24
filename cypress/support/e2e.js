// cypress/support/e2e.js
import './commands';

// Ignore uncaught JS errors from the application
// (Squarespace requires jQuery from external CDN which is blocked in CI)
Cypress.on('uncaught:exception', () => false);