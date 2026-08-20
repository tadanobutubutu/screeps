tsx
import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // ... other state variables and functions ...

  return (
    <div>
      {/* ... other non-landmark components ... */}
      <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
            {/* ... error handling buttons ... */}
          </>
        )}
        {/* The following code would go inside a <section> or <article> element in a success state */}
        {/* ... success state content ... */}
      </main>
      {/* ... other non-landmark components ... */}
    </div>
  );
};

export default Dashboard;