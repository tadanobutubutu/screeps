/**
 * Main entry point for Jest testing
 * This file should not contain JSX
 */

module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
  ],
};

// Note: JSX files (app/layout.tsx, etc.) should be .tsx files
// and should include <main> landmarks for accessibility (REACT_017)

// Ensure that the rendered HTML includes a <main> element for accessibility (REACT_017)