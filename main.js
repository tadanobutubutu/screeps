// main.js
// [Your existing imports and code above]

// Update Jest configuration for v30
const jestConfig = {
  // Existing Jest configuration
  // ...
  // Add/update Jest v30 specific configurations
  testEnvironment: 'jest-environment-node',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }]
  }
};

// Update ESLint configuration for v10
const eslintConfig = {
  // Existing ESLint configuration
  // ...
  // Add/update ESLint v10 specific configurations
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  settings: {
    react: {
      version: '19.0.0' // Updated React version
    }
  }
};

// Update TypeScript configuration for v7
const tsConfig = {
  // Existing TypeScript configuration
  // ...
  // Add/update TypeScript v7 specific configurations
  compilerOptions: {
    target: 'ES2022',
    module: 'ESNext',
    lib: ['ES2022', 'DOM'],
    jsx: 'react-jsx',
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true
  }
};

// Update React version in package dependencies
const packageDependencies = {
  // Existing dependencies
  // ...
  // Update React and related packages
  'react': '^19.0.0',
  'react-dom': '^19.0.0',
  '@types/react': '^19.0.0',
  '@types/react-dom': '^19.0.0'
};

// Update Node.js version in various configurations
const nodeVersion = '24';

// [Your existing exports and functions below]
// Make sure to preserve all existing exports and functions