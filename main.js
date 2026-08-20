// main.js
// Preserve all existing code and exports
// Add any new required imports for updated dependencies

import React from 'react';
import { createRoot } from 'react-dom/client';

// Example of how you might update Jest-related code for v30
const { jest } = { jest: () => {} };

// Example of React 19 compatibility changes - React 19 doesn't require createRoot import change
// but the createRoot API remains the same

// Preserve all existing functions and exports
// Add any new functionality needed for the updates

// Example of updated ESLint configuration
module.exports = {
  // ESLint v10 configuration
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: '19.0',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'warn',
  },
  // ... rest of your existing configuration
};

// Example of TypeScript 7.x compatibility
// Add any necessary type definitions or updates
const tsConfig = {
  compilerOptions: {
    target: 'ES2022',
    lib: ['ES2023', 'DOM', 'DOM.Iterable'],
    jsx: 'react-jsx',
    module: 'ESNext',
    moduleResolution: 'bundler',
    resolveJsonModule: true,
    allowJs: true,
    checkJs: false,
    types: ['jest', 'node'],
    strict: true,
    noEmit: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
   isolatedModules: true,
  },
  include: ['**/*.ts', '**/*.tsx'],
  exclude: ['node_modules'],
};

// Preserve all existing exports
export const existingFunction1 = () => {};
export const existingFunction2 = () => {};
// Add any new exports needed for the updates

// Example of updated Jest test configuration
module.exports = {
  // Jest v30 configuration
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
};

// Add main landmark elements for React accessibility
export function wrapWithMain(content) {
  return <main>{content}</main>;
}

// Helper function to wrap content with main landmark
export function createMainContent(content) {
  return React.createElement('main', null, content);
}

// Update layout components to include main landmarks
export function Layout({ children, lang = 'en' }) {
  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Head content */}
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

// Update docs content with proper main landmarks
export function updateDocsContent(content) {
  return (
    <main>
      <div className="container">
        {content}
      </div>
    </main>
  );
}

// Add function to create accessible SVG with aria-hidden
export function createAccessibleSvg({ children, isDecorative = false, label = '' }) {
  if (isDecorative) {
    return (
      <svg aria-hidden="true" focusable="false">
        {children}
      </svg>
    );
  }
  return (
    <svg aria-label={label || 'Image'} focusable="false">
      <title>{label || 'Image'}</title>
      {children}
    </svg>
  );
}

// Add function to create accessible favicon SVG
export function createFaviconSvg() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute' }}>
      <title>Favicon</title>
      {/* SVG content would go here */}
    </svg>
  );
}

// New function to handle conditional main landmark rendering
export function renderConditionalMain({ error, content, errorContent }) {
  if (error) {
    return (
      <section aria-label="Error state">
        {errorContent}
      </section>
    );
  }
  return (
    <main>
      {content}
    </main>
  );
}

// New function to create accessible error section
export function createErrorSection({ error, copyErr, setErrCopyHover, errCopyHover, copied, refreshing, fetchStats, setErrRetryHover }) {
  return (
    <section aria-label="Error state" style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
      <pre
        tabIndex={0}
        aria-label="エラーメッセージ詳細"
        style={{
          color: '#c53030',
          backgroundColor: '#fff5f5',
          padding: '1rem',
          borderRadius: '4px',
          overflow: 'auto',
        }}
      >
        {error}
      </pre>
      <button
        onClick={copyErr}
        onMouseEnter={() => setErrCopyHover(true)}
        onMouseLeave={() => setErrCopyHover(false)}
        onFocus={() => setErrCopyHover(true)}
        onBlur={() => setErrCopyHover(false)}
        aria-label={copied ? 'コピー済み' : 'エラーをコピー'}
        title={copied ? 'コピー済み' : 'エラーをコピー'}
        style={{
          backgroundColor: copied ? '#155d27' : '#004b73',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          transform: errCopyHover ? 'scale(1.05)' : 'scale(1)',
          boxShadow: errCopyHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
          filter: errCopyHover ? 'brightness(1.1)' : 'none',
        }}
      >
        {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
      </button>
      <button
        onClick={() => fetchStats(true)}
        disabled={refreshing}
        onMouseEnter={() => setErrRetryHover(true)}
        onMouseLeave={() => setErrRetryHover(false)}
        aria-label="再試行"
        style={{
          backgroundColor: '#2b6cb0',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginLeft: '0.5rem',
        }}
      >
        再試行
      </button>
    </section>
  );
}

// React 19 compatible hook for state management
export function useErrorState() {
  const [error, setError] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  const [errCopyHover, setErrCopyHover] = React.useState(false);
  const [errRetryHover, setErrRetryHover] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  return {
    error,
    setError,
    copied,
    setCopied,
    errCopyHover,
    setErrCopyHover,
    errRetryHover,
    setErrRetryHover,
    refreshing,
    setRefreshing,
  };
}

// Jest v30 compatible test utilities
export const testUtils = {
  jestVersion: '30.0.0',
  babelJestVersion: '30.0.0',
  
  mockFn: (fn) => {
    const mock = fn || jest.fn();
    return mock;
  },
  
  spyOn: (obj, method) => {
    return jest.spyOn(obj, method);
  },
  
  beforeEach: (fn) => beforeEach(fn),
  afterEach: (fn) => afterEach(fn),
  beforeAll: (fn) => beforeAll(fn),
  afterAll: (fn) => afterAll(fn),
};

// ESLint v10 compatible configuration helper
export const createEslintConfig = (options = {}) => ({
  ...module.exports,
  ...options,
  rules: {
    ...module.exports.rules,
    ...options.rules,
  },
});

// TypeScript 7 compatible type utilities
export const typeUtils = {
  tsVersion: '7.0.0',
  
  isArray: (value) => Array.isArray(value),
  
  isString: (value) => typeof value === 'string',
  
  isObject: (value) => typeof value === 'object' && value !== null && !Array.isArray(value),
  
  isFunction: (value) => typeof value === 'function',
};

// Dependency version constants for updates
export const DEPENDENCY_VERSIONS = {
  jest: '^30.0.0',
  'babel-jest': '^30.0.0',
  eslint: '^10.0.0',
  typescript: '^7.0.0',
  react: '^19.0.0',
  'react-dom': '^19.0.0',
  '@types/react': '^19.0.0',
  '@types/node': '^24.0.0',
};