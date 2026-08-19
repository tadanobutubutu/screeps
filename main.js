tsx
// In app/layout.tsx
import React from 'react';
// ...
function Layout({ children }) {
  // ...
  return (
    // ...
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A simple react web app for testing purposes only.">
    <link rel="icon" href="/favicon.ico">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 62q17 0 31-14t14-31h-16L32 30q-28-11-43.5-26.5T0 15v44q7 0 16.5-3.5t31-17.5h16l11-17q28 10 43.5 27T32 62z"></path></svg>
    {/* ... */}
  );
}
export default Layout;

// In dashboard/app/layout.tsx
import React from 'react';
// ...
function Layout({ children }) {
  // ...
  return (
    // ...
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 30q28-10 43.5-27T64 15v11q-28 11-43.5 26.5T32 62q-17 0-31-14t-14-31h-16l-11-17q-28-10-43.5-27T0 30v-44q7 0-16.5 3.5t-31 17.5h-16z"></path></svg>
    {/* ... */}
  );
}
export default Layout;

// In components/Dashboard.tsx
import React, { useState } from 'react';

function Dashboard() {
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const copyErr = () => {
    navigator.clipboard.writeText(error);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
          title="再試行"
          style={{
            backgroundColor: '#004b73',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '1rem',
            transition: 'all 0.2s ease-in-out',
            transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
            boxShadow: errRetryHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
            filter: errRetryHover ? 'brightness(1.1)' : 'none',
          }}
        >
          🔄 再試行
        </button>
      </div>
    );
  }

  // Success state content
  return (
    <div style={{ padding: '2rem' }}>
      {/* Dashboard content */}
    </div>
  );
}

export default Dashboard;