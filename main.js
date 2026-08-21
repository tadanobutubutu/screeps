tsx
// dashboard/components/Dashboard.tsx

import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const copyErr = () => {
    // Implementation to copy error message
  };

  const fetchStats = (shouldRefresh: boolean) => {
    // Implementation to fetch stats
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {/* ... other code ... */}
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
          {/* ... other error-related code ... */}
        </main>
      )}
      {/* ... other code ... */}
    </div>
  );
};

export default Dashboard;