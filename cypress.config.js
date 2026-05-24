const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    pageLoadTimeout: 30000,        // ← don't wait longer than needed
    blockHosts: [                  // ← block all external CDN requests
      '*.squarespace.com',
      '*.sqdcdn.com',
      '*.googleapis.com',
      '*.google-analytics.com',
      '*.googletagmanager.com',
      '*.facebook.net',
      '*.opentable.com',
    ],
  },
});