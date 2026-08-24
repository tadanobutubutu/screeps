tsx
import React, { useState } from 'react';

interface DashboardProps {
  error: string | null;
  copied: boolean;
  refreshing: boolean;
  errCopyHover: boolean;
  errRetryHover: boolean;
  setErrCopyHover: (hover: boolean) => void;
  setErrRetryHover: (hover: boolean) => void;
  copyErr: () => void;
  fetchStats: (force: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  error,
  copied,
  refreshing,
  errCopyHover,
  errRetryHover,
  setErrCopyHover,
  setErrRetryHover,
  copyErr,
  fetchStats,
}) => {
  const [errCopyHoverState, setErrCopyHoverState] = useState(errCopyHover);
  const [errRetryHoverState, setErrRetryHoverState] = useState(errRetryHover);

  const handleMouseEnter = (hover: boolean) => {
    if (hover) {
      setErrCopyHoverState(true);
      setErrRetryHoverState(true);
    }
  };

  const handleMouseLeave = () => {
    setErrCopyHoverState(false);
    setErrRetryHoverState(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {error && (
        <main>
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
            onMouseEnter={() => handleMouseEnter(true)}
            onMouseLeave={handleMouseLeave}
            onFocus={() => handleMouseEnter(true)}
            onBlur={handleMouseLeave}
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
              transform: errCopyHoverState ? 'scale(1.05)' : 'scale(1)',
              boxShadow: errCopyHoverState ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
              filter: errCopyHoverState ? 'brightness(1.1)' : 'none',
            }}
          >
            {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
          </button>
        </main>
      )}
      <button
        onClick={() => fetchStats(true)}
        disabled={refreshing}
        onMouseEnter={() => handleMouseEnter(false)}
        onMouseLeave={handleMouseLeave}
      >
        {refreshing ? '🔄 リフレッシュ中...' : '🔄 リフレッシュ'}
      </button>
    </div>
  );
};

export default Dashboard;