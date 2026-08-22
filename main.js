// Assuming main.js is using an import statement for the SVGs
import favicon from './path/to/favicon.svg';

// If the import is directly used in the HTML, you might need to modify the HTML template
// For example, if you're using React and have a component that renders the favicon like this:
export default function FaviconComponent() {
  return (
    <link rel="icon" href={favicon} />
  );
}

// To apply aria-hidden="true", you can create a new component or modify the existing one
import React from 'react';

export default function FaviconComponent() {
  return (
    <link
      rel="icon"
      href={favicon}
      aria-hidden="true" // This attribute will make the SVG invisible to assistive technologies
    />
  );
}

// If you are using a different method to set the favicon, such as directly in the head of your HTML file,
// you would update it as follows:
// <link rel="icon" href={favicon} aria-hidden="true" />

// If you are using a script tag to set the favicon, and you have access to modify the script tag:
// <script type="text/javascript">
//   ... "true");
// </script>

// Please note that if you are using the SVG as a child of a link tag, you should also add aria-hidden to the link:
// <link rel="icon" href={favicon} aria-hidden="true">
//   <svg ... viewBox="0 0 100 100">
//     <text y="0.9em" ...
//   </svg>
// </link>

// FIX: Replace duplicate <main> elements with <section> for accessibility (REACT_025)
export function ErrorDisplay({ error, copyErr, copied, errCopyHover, setErrCopyHover, fetchStats, refreshing, setErrRetryHover, errRetryHover }) {
  return (
    <section
      aria-labelledby="error-heading"
      style={{ padding: '2rem', fontFamily: 'monospace' }}
    >
      <h2 id="error-heading" style={{ color: '#b71c1c' }}>⚠️ エラー</h2>
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
          backgroundColor: '#004b73',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        🔄 再試行
      </button>
    </section>
  );
}