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
    // Implement error copying logic
  };

  const fetchStats = (shouldRetry: boolean) => {
    // Implement stats fetching logic
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
          {/* ... rest of the error handling UI ... */}
        </main>
      )}
      {success && (
        <main>
          <h1 style={{ color: '#155d27' }}>🎉 Success</h1>
          <section>
            {/* ... rest of the success state content ... */}
          </section>
        </main>
      )}
      {!error && !success && (
        // This is where you might have other UI components
        // without rendering a main element
      )}
    </div>
  );
};

export default Dashboard;
export { copyErr, fetchStats };