tsx
import React from 'react';

interface DashboardProps {
  error?: string;
  copied: boolean;
  errCopyHover: boolean;
  errRetryHover: boolean;
  refreshing: boolean;
  copyErr: () => void;
  setErrCopyHover: (hover: boolean) => void;
  setErrRetryHover: (hover: boolean) => void;
  fetchStats: (force?: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  error,
  copied,
  errCopyHover,
  errRetryHover,
  refreshing,
  copyErr,
  setErrCopyHover,
  setErrRetryHover,
  fetchStats,
}) => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <main>
        {error ? (
          <section>
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
        ) : (
          <section>
            {/* ... other content for the success state ... */}
          </section>
        )}
      </main>
      <button
        onClick={() => fetchStats(true)}
        disabled={refreshing}
        onMouseEnter={() => setErrRetryHover(true)}
        onMouseLeave={() => setErrRetryHover(false)}
      >
        {/* ... button content ... */}
      </button>
    </div>
  );
};

export default Dashboard;