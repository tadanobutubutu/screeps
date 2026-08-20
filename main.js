tsx
// Assuming the rest of the Dashboard.tsx file is here and that there are multiple <main> elements

// Replace the existing <main> elements with a single <main> element
// and move the content of the other <main> elements into <section> or <article> tags.

// Example of how to refactor the file:
import React from 'react';

const Dashboard: React.FC = () => {
  const [error, setError] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [errCopyHover, setErrCopyHover] = React.useState(false);
  const [errRetryHover, setErrRetryHover] = React.useState(false);

  const copyErr = () => {
    // ... copy error message logic
  };

  const fetchStats = (shouldRefresh) => {
    // ... fetch stats logic
  };

  return (
    <div>
      {/* Assuming the error state and success state are mutually exclusive */}
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
            {/* ... rest of the error state content */}
          </main>
        </section>
      )}
      {/* ... other content */}
      <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
        {/* ... content for the main state */}
      </main>
      {/* ... rest of the component */}
    </div>
  );
};

export default Dashboard;