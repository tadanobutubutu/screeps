// @ts-check
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})(require('./jest.config'))

module.exports = createJestConfig({
  // Add more config options here
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  // New config for handling the REACT_025 warning
  transformIgnorePatterns: [
    // ... existing patterns
    '^(?!.*\\.(jsx|tsx|js|jsx)$)', // Ensure Jest does not transform non-JSX files
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'], // Ensure Jest knows to look for these file extensions
  testMatch: ['**/*.(spec|test).(js|jsx|ts|tsx)'], // Match test files by convention
})