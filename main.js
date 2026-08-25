tsx
import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const copyErr = () => {
    // Implementation to copy error
    setCopied(true);
  };

  const fetchStats = (shouldRefresh: boolean) => {
    setRefreshing(shouldRefresh);
    // Implementation to fetch stats
    setRefreshing(false);
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
          {/* ... rest of the error state JSX */}
        </main>
      )}
      {success && (
        <main>
          {/* ... success state JSX */}
        </main>
      )}
      {/* ... rest of the component JSX */}
    </div>
  );
};

export default Dashboard;