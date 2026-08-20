// main.js
// Preserve all existing code and exports
// Add any new required imports for updated dependencies

// Example of how you might update Jest-related code for v30
const { jest } = require('@jest/globals');

// Example of React 19 compatibility changes
import React from 'react';
import { createRoot } from 'react-dom/client';

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
    'plugin:react/jsx-runtime',
  ],
  // ... rest of your existing configuration
};

// Example of TypeScript 7.x compatibility
// Add any necessary type definitions or updates

// Preserve all existing exports
export { existingFunction1, existingFunction2 };
// Add any new exports needed for the updates

// Example of updated Jest test configuration
module.exports = {
  // Jest v30 configuration
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // ... rest of your existing Jest config
};

// Add main landmark elements for React accessibility
export function wrapWithMain(content) {
  return <main aria-label="Main content">{content}</main>;
}

// Helper function to wrap content with main landmark
export function createMainContent(content) {
  return React.createElement('main', { 'aria-label': 'Main content' }, content);
}

// Update layout components to include main landmarks
export function updateLayoutWithMain(children) {
  return (
    <html lang="ja">
      <head>
        {/* Head content */}
      </head>
      <body>
        <main aria-label="Main content">{children}</main>
      </body>
    </html>
  );
}

// Update docs content with proper main landmarks
export function updateDocsContent(content) {
  return (
    <main aria-label="Documentation content">
      <div className="container">
        {content}
      </div>
    </main>
  );
}

// Add function to create accessible SVG with aria-hidden
export function createAccessibleSvg({ children, isDecorative = false }) {
  if (isDecorative) {
    return <svg aria-hidden="true">{children}</svg>;
  }
  return (
    <svg aria-label="Graphic content">
      <title>Graphic content</title>
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
    <main aria-label="Main content">
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

// New function to create accessible table structure
export function createAccessibleTable({ headers, data, caption }) {
  return (
    <table aria-label={caption}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={`header-${index}`} scope="col">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// New function to create accessible navigation landmark
export function createNavLandmark({ children, label }) {
  return (
    <nav aria-label={label}>
      {children}
    </nav>
  );
}

// New function to create accessible header landmark
export function createHeaderLandmark({ children, label }) {
  return (
    <header aria-label={label}>
      {children}
    </header>
  );
}

// New function to create accessible footer landmark
export function createFooterLandmark({ children, label }) {
  return (
    <footer aria-label={label}>
      {children}
    </footer>
  );
}

// New function to create accessible main landmark with unique ID
export function createUniqueMainLandmark({ children, id }) {
  return (
    <main id={id} aria-label="Main content">
      {children}
    </main>
  );
}

// New function to create accessible fake link
export function createAccessibleFakeLink({ children, onClick, ariaLabel }) {
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={ariaLabel}
      style={{ cursor: 'pointer', textDecoration: 'underline' }}
    >
      {children}
    </span>
  );
}