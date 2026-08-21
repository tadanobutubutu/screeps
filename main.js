// Existing code before the conflict markers

// New function to handle the updated dependency `jest`
function setupTestEnv() {
  // Use Jest version 30
  require('jest-resolve');
  require('jest');
}

// New function to handle the updated dependencies `eslint` and `babel-jest`
function fixLintingAndTesting() {
  // Use `eslint` version 10
  const eslint = require('eslint');

  // Use `babel-jest` version 30
  const babelJest = require('babel-jest');

  // Configure ESLint and Babel Jest
  eslint.configure({
    // ... your existing ESLint configuration
  });

  babelJest.configure({
    // ... your existing Babel Jest configuration
  });
}

// Existing code after the conflict markers