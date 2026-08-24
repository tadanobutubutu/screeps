tsx
// Dashboard.tsx
import React, { useState } from 'react';

interface DashboardProps {
  error?: string;
  copied?: boolean;
  refreshing?: boolean;
  errCopyHover?: boolean;
  errRetryHover?: boolean;
  fetchStats: () => void;
  copyErr: () => void;
  setErrCopyHover: (value: boolean) => void;
  setErrRetryHover: (value: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  error,
  copied,
  refreshing,
  errCopyHover,
  errRetryHover,
  fetchStats,
  copyErr,
  setErrCopyHover,
  setErrRetryHover,
}) => {
  const [mainContent, setMainContent] = useState(error || 'Default content');

  const renderContent = () => {
    if (error) {
      return (
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
          {/* ... other error handling components */}
        </section>
      );
    } else {
      return (
        <main>
          {/* Main content here */}
        </main>
      );
    }
  };

  return (
    <div>
      {renderContent()}
      {/* ... other components */}
    </div>
  );
};

export default Dashboard;