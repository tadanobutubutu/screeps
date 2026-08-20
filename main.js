tsx
// Existing code...
import React, { useState } from 'react';

interface DashboardProps {
  // props definition
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const copyErr = () => {
    // copy error logic
    setCopied(true);
  };

  const fetchStats = (shouldRefresh: boolean) => {
    // fetch stats logic
    setRefreshing(shouldRefresh);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {/* ... other code ... */}
      {error && (
        <section aria-labelledby="error-header">
          <h1 id="error-header" style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
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
          {/* ... other code ... */}
        </section>
      )}
      {/* ... rest of the component ... */}
    </div>
  );
};

export default Dashboard;