// Assuming the Dashboard component is defined in Dashboard.tsx
import React from 'react';

const Dashboard = ({ error, copied, copyErr, setErrCopyHover, errCopyHover, refreshing, setErrRetryHover, fetchStats }) => {
  // ... other component logic ...

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {/* Assuming the success state and error state are mutually exclusive */}
      {error && (
        <main>
          <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
          {/* ... error handling elements ... */}
        </main>
      )}
      {!error && (
        <main>
          {/* ... other main content ... */}
        </main>
      )}
      {/* ... other component content ... */}
    </div>
  );
};

export default Dashboard;