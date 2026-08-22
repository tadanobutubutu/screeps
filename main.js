Here is the resolved file content:

```javascript
// @ts-check
const nextJest = require('next/jest')
const { createJestConfig, testPathIgnorePatterns } = nextJest({
  dir: './',
})(require('./jest.config'));

createJestConfig({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/build/'],
  transform: {
    '^\\.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
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
})

tsx
import type { Metadata, Viewport } from "next";
import './globals.css';

export const metadata: Metadata = {
  title: "Screeps Dashboard",
  description: "Screeps game dashboard to view statistics and manage your account",
  icons: {
    icon: {
      url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><title>Screeps Dashboard</title><text y='.9em' font-size='90'>&#x1f4ca;</text></svg>",
      type: "image/svg+xml",
    },
    apple: {
      url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><title>Screeps Dashboard</title><text y='.9em' font-size='90'>&#x1f4ca;</text></svg>",
      type: "image/svg+xml",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0078c7",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

This file combines the TypeScript setup from the first conflict block and the Jest configuration from the second block. It also modifies the `testPathIgnorePatterns` to include the ignored paths from both conflicts. This should prevent any issues with SVG files and the 'build' folder, and still support the TypeScript imports in the `main.js` file.