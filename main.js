// This is not a main.js issue - the problem is with Jest configuration
// The testPathIgnorePatterns is matching all files, not just node_modules

// To fix this issue, you need to update your Jest configuration
// Create or update jest.config.js with proper settings:

module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.js',
    '**/*.test.js',
    '**/*.spec.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ]
};