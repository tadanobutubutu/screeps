import React from 'react';

// ... other imports and component logic ...

const Dashboard = ({ error, copied, errCopyHover, errRetryHover, refreshing, copyErr, fetchStats }) => {
  // ... existing code ...

  // Refactored to use a single <main> and conditional rendering
  const renderMainContent = () => {
    if (error) {
      return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
          {/* ... error state content ... */}
        </main>
      );
    } else if (copied) {
      return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
          {/* ... success state content ... */}
        </main>
      );
    }
    // Add other conditions as necessary for different states
    // ...
  };

  return (
    <div>
      {renderMainContent()}
      {/* ... rest of the component ... */}
    </div>
  );
};

export default Dashboard;

// ... rest of the main.js content ...