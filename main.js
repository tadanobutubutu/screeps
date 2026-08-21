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
  // Add the following to handle SVG files in Jest
  transformIgnorePatterns: [
    '/node_modules/(?!@testing-library)/',
    // Add any other patterns here if needed
  ],
  // Add the following to handle SVG parsing with svgo
  transform: {
    ...transform,
    '\\.(svg)$': 'jest-transform-stub'
  },
};

// Note: JSX files (app/layout.tsx, etc.) should be .tsx files
// and should include <main> landmarks for accessibility (REACT_017)