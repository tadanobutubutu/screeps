tsx
import React, { useState } from 'react';

// Extract the common structure into a separate component
const ErrorComponent = ({ error, copyErr, copied, errCopyHover, setErrCopyHover, fetchStats, refreshing }) => {
  return (
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
      {/* ... other buttons and logic ... */}
    </main>
  );
};

const SuccessComponent = ({ /* props for success state */ }) => {
  // Render the success state UI here
  return (
    // ... success state JSX ...
  );
};

const Dashboard: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [errCopyHover, setErrCopyHover] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const copyErr = () => {
    // Logic to copy error
  };

  const fetchStats = (shouldFetch: boolean) => {
    // Logic to fetch stats
  };

  return (
    <div>
      {error ? (
        <ErrorComponent
          error={error}
          copyErr={copyErr}
          copied={copied}
          errCopyHover={errCopyHover}
          setErrCopyHover={setErrCopyHover}
          fetchStats={fetchStats}
          refreshing={refreshing}
        />
      ) : (
        <SuccessComponent /* pass necessary props */ />
      )}
    </div>
  );
};

export default Dashboard;