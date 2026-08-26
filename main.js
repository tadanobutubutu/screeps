tsx
// Incorrect file structure with multiple <main> elements
import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  // ... other code ...

  return (
    <>
      <main> {/* First <main> element */}
        {/* ... content for main state */}
      </main>
      {error && (
        <main> {/* Second <main> element */}
          <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
            {/* ... rest of the error content */}
          </div>
        </main>
      )}
      {/* ... other components */}
    </>
  );
};

export default Dashboard;