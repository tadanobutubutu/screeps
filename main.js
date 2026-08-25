tsx
// Dashboard.tsx
import React from 'react';

interface DashboardProps {
  error: string | null;
  copied: boolean;
  refreshing: boolean;
  errCopyHover: boolean;
  errRetryHover: boolean;
  copyErr: () => void;
  fetchStats: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  error,
  copied,
  refreshing,
  errCopyHover,
  errRetryHover,
  copyErr,
  fetchStats,
}) => {
  return (
    <div>
      {error ? (
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
            {/* ... other error-related components ... */}
          </main>
        </section>
      ) : (
        <section>
          <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            {/* ... content for the main section ... */}
          </main>
        </section>
      )}
    </div>
  );
};

export default Dashboard;