tsx
import React, { useState } from 'react';

interface DashboardProps {
  error?: string;
  success?: string;
  refreshing?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ error, success, refreshing }) => {
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyErr = () => {
    // copy error code to clipboard logic
    setCopied(true);
    // Set a timeout to uncopy after 5 seconds or remove if not necessary
    setTimeout(() => setCopied(false), 5000);
  };

  // ... other component logic ...

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {/* Error section */}
      {error && (
        <section aria-label="Error section">
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
          {/* Error-related buttons */}
          <button onClick={copyErr} /* other button attributes */></button>
          {/* Other components */}
        </section>
      )}

      {/* Success section */}
      {success && (
        <section aria-label="Success section">
          {/* Content for success state */}
        </section>
      )}

      {/* Refresh button */}
      <button onClick={() => fetchStats(true)} /* disabled={refreshing}, other button attributes */}></button>
      {/* ... other components */}
    </div>
  );
};

export default Dashboard;