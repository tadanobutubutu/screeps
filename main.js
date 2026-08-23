module.exports = {
  // ... other Jest configuration options ...

  // Custom matchers or ignore patterns
  testMatch: [
    '**/__tests__/**/*.js?(x)',
    '**/?(*.)+(spec|test).js?(x)',
    // Ignore the REACT_025 warning for specific lines in Dashboard.tsx
    '!**/components/Dashboard.tsx:309',
    // New ignore pattern for REACT_036 fake link issue in specific file
    '!**/components/FakeLinkComponent.tsx:123',
  ],
  testEnvironment: 'jsdom',
  // ... other Jest configuration options ...
};