import React, { useState } from 'react';

interface DashboardProps {
  error?: string;
  copied: boolean;
  errCopyHover: boolean;
  errRetryHover: boolean;
  refreshing: boolean;
  copyErr: () => void;
  fetchStats: (retry: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  error,
  copied,
  errCopyHover,
  errRetryHover,
  refreshing,
  copyErr,
  fetchStats,
}) => {
  const [isRotated, setIsRotated] = useState(false);
  const [rotateHover, setRotateHover] = useState(false);
  const [errCopyHoverLocal, setErrCopyHoverLocal] = useState(false);

  return (
    <div lang="en" style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
        id="unrotate"
        onClick={() => setIsRotated(false)}
        onMouseEnter={() => setRotateHover(true)}
        onMouseLeave={() => setRotateHover(false)}
        style={{
          backgroundColor: rotateHover ? '#155d27' : '#004b73',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          transform: rotateHover ? 'scale(1.05)' : 'scale(1)',
          boxShadow: rotateHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
          filter: rotateHover ? 'brightness(1.1)' : 'none',
        }}
      >
        rotate back
      </button>
      <button
        onClick={copyErr}
        onMouseEnter={() => setErrCopyHoverLocal(true)}
        onMouseLeave={() => setErrCopyHoverLocal(false)}
        onFocus={() => setErrCopyHoverLocal(true)}
        onBlur={() => setErrCopyHoverLocal(false)}
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
        {/* The content of this button remains the same */}
      </button>
      <main
        style={{
          transform: isRotated ? 'rotate(-15deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <section>
          {/* Content that was originally in the second <main> */}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;