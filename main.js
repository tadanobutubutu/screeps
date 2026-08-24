tsx
// Assume that `Dashboard.tsx` has multiple states or components that need to be separated.
// This example assumes there are error and success states and a retry button.

import React from 'react';

interface DashboardProps {
  // ... other props
  error?: string;
  copied?: boolean;
  refreshing?: boolean;
  // ... other props
}

const Dashboard: React.FC<DashboardProps> = ({ error, copied, refreshing }) => {
  // ... existing state and props handling

  return (
    <main>
      {/* Render the main content */}
      <section id="content">
        {/* ... content for both error and success states */}
      </section>

      {/* Render error state if there is an error */}
      {error && (
        <section id="error-state">
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
        </section>
      )}

      {/* Render success state if there is no error */}
      {!error && (
        <section id="success-state">
          {/* ... success state content */}
        </section>
      )}

      {/* Render retry button if there is an error */}
      {error && (
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          onMouseEnter={() => setErrRetryHover(true)}
          onMouseLeave={() => setErrRetryHover(false)}
        >
          {refreshing ? 'リフレッシュ中...' : 'リフレッシュ'}
        </button>
      )}
    </main>
  );
};

export default Dashboard;