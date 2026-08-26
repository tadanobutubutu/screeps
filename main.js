tsx
import React from 'react';

interface DashboardProps {
  error?: string;
  refreshing?: boolean;
  copiy?: boolean;
  errCopyHover?: boolean;
  errRetryHover?: boolean;
  setErrCopyHover: React.Dispatch<React.SetStateAction<boolean>>;
  setErrRetryHover: React.Dispatch<React.SetStateAction<boolean>>;
  fetchStats: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  error,
  refreshing,
  copied,
  errCopyHover,
  errRetryHover,
  setErrCopyHover,
  setErrRetryHover,
  fetchStats,
}) => {
  // Render the main content conditionally
  const renderMainContent = () => {
    if (error) {
      return (
        <main>
          {/* Error state content */}
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
          />
        </main>
      );
    }
    // Render the success state content here, which could be in a separate section/article if needed
    return <main> {/* Success state content */}</main>;
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {renderMainContent()}
      {/* Other components that are not part of the main content */}
    </div>
  );
};

export default Dashboard;