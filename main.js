import React, { useState } from 'react';

export const metadata = {
    // ... other metadata
    icons: {
        icon: ... ... viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 ...
    },
};

const Dashboard = () => {
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const copyErr = () => {
    ... => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    });
  };

  const fetchStats = () => {
    // Existing fetchStats logic
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <main>
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
            <button
              type="button"
              onClick={copyErr}
              onMouseEnter={() => setErrCopyHover(true)}
              onMouseLeave={() => ...
              onFocus={() => setErrCopyHover(true)}
              onBlur={() => ...
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
              type="button"
              ...
              disabled={refreshing}
              aria-disabled={refreshing}
              aria-busy={refreshing}
              onMouseEnter={() => setErrRetryHover(true)}
              onMouseLeave={() => setErrRetryHover(false)}
            >
              {/* ... existing success button ... */}
            </button>
          </>
        )}

        {!error && (
          <section>
            <h1 style={{ color: '#b71c1c' }}>成功</h1>
            <p>統計が取得されました。</p>
            <button
              type="button"
              ...
              disabled={refreshing}
              aria-disabled={refreshing}
              aria-busy={refreshing}
              style={{
                /* ... existing styles ... */
              }}
            >
              {/* ... existing success button ... */}
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;