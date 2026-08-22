Here is the resolved file content:

```javascript
// @ts-check
const nextJest = require('next/jest')
const { createJestConfig, testPathIgnorePatterns } = nextJest({
  dir: './',
})(require('./jest.config'))

createJestConfig({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',

  // Incorporate the Next.js Metadata and Viewport configuration
  metadata: {
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
  },

  viewport: {
    themeColor: "#0078c7",
    width: "device-width",
    initialScale: 1,
    minimumScale: 1,
  },

  // Incorporate the Next.js RootLayout
  RootLayout: ({ children }) => (
    <html lang="en">
      <body>{children}</body>
    </html>
  ),

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
```

This resolved file content incorporates both changes, keeping the Next.js Metadata and Viewport configuration and the Jest configuration from the conflicting branches. It also merges the testPathIgnorePatterns, adding `'<rootDir>/build/'` to ignore files related to the build process. Additionally, it includes the RootLayout from the Next.js project.