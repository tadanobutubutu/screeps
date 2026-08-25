tsx
import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ... existing code ...

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {/* Render error state */}
      {error && (
        <>
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
          {/* ... rest of error handling code ... */}
        </>
      )}
      {/* Render success state */}
      {!error && (
        <>
          {/* ... success view elements ... */}
        </>
      )}
      {/* ... rest of existing code ... */}
    </main>
  );
};

export default Dashboard;