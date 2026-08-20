// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';

// Preserve all existing functions and exports
const existingFunction1 = () => {};
const existingFunction2 = () => {};

// ESLint configuration
module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
  ],
};

// TypeScript type definitions
interface AccessibleSvgProps {
  children?: React.ReactNode;
  isDecorative?: boolean;
}

interface ErrorSectionProps {
  error: string;
  copyErr: () => void;
  setErrCopyHover: (hover: boolean) => void;
  errCopyHover: boolean;
  copied: boolean;
  refreshing: boolean;
  fetchStats: (refresh?: boolean) => void;
  setErrRetryHover: (hover: boolean) => void;
}

// Main landmark component for React accessibility
export function wrapWithMain(content: React.ReactNode) {
  return <main>{content}</main>;
}

// Helper function to wrap content with main landmark
export function createMainContent(content: React.ReactNode) {
  return React.createElement('main', null, content);
}

// Update layout components to include main landmarks
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {/* Head content */}
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

// Update docs content with proper main landmarks
export function updateDocsContent(content: React.ReactNode) {
  return (
    <main>
      <div className="container">
        {content}
      </div>
    </main>
  );
}

// Create accessible SVG with aria-hidden
export function createAccessibleSvg({ children, isDecorative = false }: AccessibleSvgProps) {
  if (isDecorative) {
    return (
      <svg aria-hidden="true">
        {children}
      </svg>
    );
  }
  return (
    <svg aria-label="Favicon">
      <title>Favicon</title>
      {children}
    </svg>
  );
}

// Create accessible favicon SVG
export function createFaviconSvg() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute' }}>
      <title>Favicon</title>
      {/* SVG content would go here */}
    </svg>
  );
}

// Handle conditional main landmark rendering
export function renderConditionalMain({ error, content, errorContent }: { error: boolean; content: React.ReactNode; errorContent: React.ReactNode }) {
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

// Create accessible error section
export function createErrorSection({
  error,
  copyErr,
  setErrCopyHover,
  errCopyHover,
  copied,
  refreshing,
  fetchStats,
  setErrRetryHover
}: ErrorSectionProps) {
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