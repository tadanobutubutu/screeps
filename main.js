tsx
// dashboard/components/Dashboard.tsx

import React from 'react';

interface DashboardProps {
  // Assuming we have some props that could be passed to this component
  error?: string;
  copied?: boolean;
  refreshing?: boolean;
  errCopyHover?: boolean;
  errRetryHover?: boolean;
  fetchStats?: () => void;
  copyErr?: () => void;
  // ... other props
}

const Dashboard: React.FC<DashboardProps> = ({
  error,
  copied,
  refreshing,
  errCopyHover,
  errRetryHover,
  fetchStats,
  copyErr,
  // ... other props
}) => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {/* Assuming the <main> element should always be present */}
      <main>
        {/* Error state handling */}
        {error && (
          <>
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
            {/* Error copy button */}
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
            {/* Retry button */}
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              onMouseEnter={() => setErrRetryHover(true)}
              onMouseLeave={() => setErrRetryHover(false)}
              // ... other event handlers
            >
              {refreshing ? '⏳ リフレッシュ中' : '🔄 リフレッシュ'}
            </button>
          </>
        )}

        {/* Success state handling */}
        {/* ... success content goes here */}
      </main>
      {/* Additional sections */}
      {/* ... other sections that do not need to be in <main> */}
    </div>
  );
};

export default Dashboard;