tsx
import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const copyErr = () => {
    // Copy error message logic
    setCopied(true);
  };

  const fetchStats = (shouldRetry: boolean) => {
    // Fetch stats logic
    setRefreshing(true);
  };

  return (
    <div>
      {/* Use a section for the error message */}
      {error && (
        <section>
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
            {/* ... rest of the error-related JSX */}
          </main>
        </section>
      )}

      {/* Use a section for the success state or other content */}
      {/* ... rest of the JSX */}
    </div>
  );
};

export default Dashboard;