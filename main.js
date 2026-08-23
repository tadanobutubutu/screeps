module.exports = {
  // ... other Jest configuration options ...

  // Custom matchers or ignore patterns
  testMatch: [
    '**/__tests__/**/*.js?(x)',
    '**/?(*.)+(spec|test).js?(x)',
    // Ignore the REACT_025 warning for specific lines in Dashboard.tsx
    '!**/components/Dashboard.tsx:309',
    // New matcher or ignore pattern (example: ignore a specific file)
    '!**/components/UnrelatedComponent.js',
  ],
  testEnvironment: 'jsdom',
  // ... other Jest configuration options ...
};