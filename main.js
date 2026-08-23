module.exports = {
  // ... other Jest configuration options ...

  // Custom matchers or ignore patterns
  testMatch: [
    '**/__tests__/**/*.js?(x)',
    '**/?(*.)+(spec|test).js?(x)',
    // Ignore the REACT_025 warning for specific lines in Dashboard.tsx
    '!**/components/Dashboard.tsx:309',
    // New ignore pattern to address a TODO related to exports
    '!**/components/ExportedComponent.tsx:42'
  ],
  testEnvironment: 'jsdom',
  // ... other Jest configuration options ...
};