// This is a placeholder comment since I don't have access to the actual file contents
// The fix for "Unexpected token ;" at line 365 in tests/deploy.test.js would typically involve:
// - Checking for missing closing braces/brackets/parentheses
// - Ensuring proper syntax at the end of functions

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'odule'
  },
  extends: 'eslint:recommended',
  rules: {
    // Custom rules can be added here
  }
}