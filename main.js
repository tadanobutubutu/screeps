tsx
import React from 'react';
import './Dashboard.css'; // Assuming the CSS for styling is present in this file

interface DashboardProps {
  error?: string;
  refreshing: boolean;
  fetchStats: () => void;
  copyErr: () => void;
  copied: boolean;
  setErrCopyHover: (hover: boolean) => void;
  setErrRetryHover: (hover: boolean) => void;
  errCopyHover: boolean;
  errRetryHover: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  error,
  refreshing,
  fetchStats,
  copyErr,
  copied,
  setErrCopyHover,
  setErrRetryHover,
  errCopyHover,
  errRetryHover
}) => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#b71c1c' }}>{error ? '⚠️ エラー' : 'Success'}</h1>
      <pre
        tabIndex={0}
        aria-label={error ? 'エラーメッセージ詳細' : 'Success message'}
        style={{
          color: error ? '#c53030' : '#2e7d32',
          backgroundColor: error ? '#fff5f5' : '#e0f7fa',
          padding: '1rem',
          borderRadius: '4px',
          overflow: 'auto',
        }}
      >
        {error || 'Success message'}
      </pre>
      {/* Other components remain unchanged */}
    </div>
  );
};

export default Dashboard;