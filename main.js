tsx
// Hypothetical Dashboard component that has been modified to remove duplicate <main> elements
import React, { useState } from 'react';

interface DashboardProps {
  error?: string;
  copied?: boolean;
  refreshing?: boolean;
  copyErr?: () => void;
  setErrCopyHover?: (value: boolean) => void;
  fetchStats?: () => void;
  // Other props...
}

const Dashboard: React.FC<DashboardProps> = ({
  error,
  copied,
  refreshing,
  copyErr,
  setErrCopyHover,
  fetchStats,
  // Other props...
}) => {
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const renderMainContent = () => {
    if (error) {
      // Error state
      return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
          {/* ... rest of the error state */}
        </main>
      );
    } else {
      // Success or other state
      return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
          {/* ... rest of the non-error state */}
        </main>
      );
    }
  };

  return (
    <div>
      {renderMainContent()}
      {/* ... other content */}
    </div>
  );
};

export default Dashboard;