module.exports = {
  // ... other Jest configuration options ...

  // Custom matchers or ignore patterns
  testMatch: [
    '**/__tests__/**/*.js?(x)',
    '**/?(*.)+(spec|test).js?(x)',
    // Ignore the REACT_025 warning for specific lines in [ADDRESS]
    '!**/components/Dashboard.tsx:309',
  ],
  testEnvironment: 'jsdom',
  // ... other Jest configuration options ...
};