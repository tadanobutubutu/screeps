tsx
import React from 'react';

interface DashboardProps {
  error?: string;
  copied?: boolean;
  refreshing?: boolean;
  errCopyHover?: boolean;
  errRetryHover?: boolean;
  // ... other props
}

const Dashboard: React.FC<DashboardProps> = ({
  error,
  copied,
  refreshing,
  errCopyHover,
  errRetryHover,
  // ... other props
}) => {
  // ... existing code

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {error && (
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
          {/* ... rest of the error section */}
        </section>
      )}
      {/* ... success state */}
    </div>
  );
};

export default Dashboard;