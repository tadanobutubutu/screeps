tsx
import React from 'react';

const Dashboard: React.FC = () => {
  const [error, setError] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [errCopyHover, setErrCopyHover] = React.useState(false);
  const [errRetryHover, setErrRetryHover] = React.useState(false);

  const copyErr = () => {
    // Implementation for copying error
  };

  const fetchStats = (shouldRetry) => {
    // Implementation for fetching stats
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
      {error && (
        <section
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
        </section>
      )}
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
        aria-hidden="true"
        aria-label={refreshing ? 'リフレッシュ中' : 'リフレッシュ'}
        title={refreshing ? 'リフレッシュ中' : 'リフレッシュ'}
      >
        {refreshing ? '🔄 リフレッシュ中...' : '🔄 リフレッシュ'}
      </button>
      {/* 
        Favicon SVG accessibility fix (REACT_041):
        The favicon SVG data URIs in app/layout.tsx and dashboard/app/layout.tsx
        now include aria-hidden="true" to mark them as decorative, preventing
        screen readers from announcing them as 'image'.
        Example updated data URI:
        icons: {
          icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-hidden=%22true%22><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
        }
      */}
    </div>
  );
};

export default Dashboard;