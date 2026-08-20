import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code (preserved)
const App = () => {
  // ... existing app code ...
};

// Existing exports (preserved)
export { App };

// Add accessibility attributes to SVG elements
const FaviconSVG = () => (
  <svg
    aria-hidden="true"
    width="0"
    height="0"
    style={{ position: 'absolute' }}
  >
    {/* SVG content */}
  </svg>
);

const MetadataSVG = () => (
  <svg
    aria-hidden="true"
    width="0"
    height="0"
    style={{ position: 'absolute' }}
  >
    {/* SVG content */}
  </svg>
);

// Update layout components to use accessible SVGs
const Layout = ({ children }) => (
  <div>
    <FaviconSVG />
    <MetadataSVG />
    {children}
  </div>
);

// Preserve any existing exports
export { Layout };

// Add language attribute to the root HTML element for accessibility
const HtmlWithLang = ({ children }) => (
  <html lang="en">
    {children}
  </html>
);

// Preserve any existing exports
export { HtmlWithLang };

// Error state component - using <section> instead of <main> to fix REACT_025 (React Unique Landmarks)
export const ErrorDisplay = ({ error, copied, errCopyHover, refreshing, copyErr, fetchStats }) => (
  <section style={{ padding: '2rem', fontFamily: 'monospace' }} aria-labelledby="error-heading">
    <h1 id="error-heading" style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
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
      onFocus={() => setErrRetryHover(true)}
      onBlur={() => setErrRetryHover(false)}
      aria-label="再試行"
      style={{
        backgroundColor: '#004b73',
        color: 'white',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginLeft: '0.5rem',
      }}
    >
      🔄 再試行
    </button>
  </section>
);