tsx
import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errCopyHover, setErrCopyHover] = useState<boolean>(false);
  const [errRetryHover, setErrRetryHover] = useState<boolean>(false);

  const copyErr = () => {
    // Implementation to copy error
    setCopied(true);
  };

  const fetchStats = (forceRefresh: boolean) => {
    // Implementation to fetch stats
    setRefreshing(true);
    // Resetting the refreshing state after fetching
    // setRefreshing(false);
  };

  const renderMainContent = () => {
    if (error) {
      return (
        <main>
          <h1>⚠️ エラー</h1>
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
          >
            {refreshing ? 'リフレッシュ中...' : '再試行'}
          </button>
        </main>
      );
    }

    // The success state return path is omitted for brevity, as it would be similar in structure.
    // ...
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#b71c1c' }}>Dashboard</h1>
      {renderMainContent()}
    </div>
  );
};

export default Dashboard;