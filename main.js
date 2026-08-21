// The main.js file should not be directly edited based on the provided information. Instead, we need to ensure that the components that render multiple <main> elements do not do so in a way that would violate the accessibility rule REACT_025.

// Assuming that the error and success states in the Dashboard component are mutually exclusive and do not need to be within the same <main> element, we can refactor the component to render the <main> element conditionally.

// Below is a conceptual example of how the Dashboard component could be refactored to avoid the issue:

import React from 'react';

interface DashboardProps {
  error?: string;
  copied: boolean;
  errCopyHover: boolean;
  errRetryHover: boolean;
  refreshing: boolean;
  // ... other props
}

const Dashboard: React.FC<DashboardProps> = ({
  error,
  copied,
  errCopyHover,
  errRetryHover,
  refreshing,
  // ... other props
}) => {
  // ... existing state and effect logic

  // Function to handle error copying
  const copyErr = () => {
    // ... existing copyErr logic
  };

  // Function to handle error retrying
  const fetchStats = (force?: boolean) => {
    // ... existing fetchStats logic
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {/* Render the main content conditionally */}
      {error ? (
        // Render the error state within a section, not a <main>
        <section>
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
        </section>
      ) : (
        // Render the success state with the <main> element
        <main>
          {/* ... existing success state logic */}
        </main>
      )}
      <button
        onClick={() => fetchStats(true)}
        disabled={refreshing}
        onMouseEnter={() => setErrRetryHover(true)}
        onMouseLeave={() => setErrRetryHover(false)}
        // ... other button props
      >
        {/* ... button content */}
      </button>
    </div>
  );
};

export default Dashboard;