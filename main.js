tsx
import React from 'react';

interface DashboardProps {
  error?: string;
  copied?: boolean;
  refreshing?: boolean;
  errCopyHover?: boolean;
  errRetryHover?: boolean;
  copyErr: () => void;
  fetchStats: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  error,
  copied,
  refreshing,
  errCopyHover,
  errRetryHover,
  copyErr,
  fetchStats,
}) => {
  return (
    <div>
      {error && (
        <section aria-label="Error state">
          <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
          </main>
        </section>
      )}
      {/* ... other components and state management ... */}
      {/* Assuming success state content is in an article */}
      <article aria-label="Success state">
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
          {/* ... success state content ... */}
        </main>
      </article>
    </div>
  );
};

export default Dashboard;