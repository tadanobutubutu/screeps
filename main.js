tsx
import React from 'react';

interface DashboardProps {
  error?: string;
  copied: boolean;
  refreshing: boolean;
  errCopyHover: boolean;
  errRetryHover: boolean;
  setErrCopyHover: (value: boolean) => void;
  setErrRetryHover: (value: boolean) => void;
  copyErr: () => void;
  fetchStats: (retry: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  error,
  copied,
  refreshing,
  errCopyHover,
  errRetryHover,
  setErrCopyHover,
  setErrRetryHover,
  copyErr,
  fetchStats,
}) => {
  // ... existing component logic ...

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {/* Render only one main element, and use conditional rendering for content */}
      {error ? (
        // Error state
        <section aria-labelledby="error-heading">
          <h1 id="error-heading" style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
          {/* ... rest of the error state content */}
        </section>
      ) : (
        // Success state
        <section aria-labelledby="success-heading">
          <h1 id="success-heading" style={{ color: '#155d27' }}>🎉 Success</h1>
          {/* ... rest of the success state content */}
        </section>
      )}
      {/* ... rest of the component */}
    </div>
  );
};

export default Dashboard;