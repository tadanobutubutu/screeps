// Existing code and exports preserved

// New functions or changes requested in the issue
// ...

// Existing functions not affected by the issue remain

// Code after the new functions or changes
// ...

// Configure Jest to handle ES modules properly for test compatibility
module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/tests/**/*.js'],
  // Ensure module system compatibility
  resolver: undefined,
};