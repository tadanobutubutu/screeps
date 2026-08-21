tsx
// dashboard/components/Dashboard.tsx
import React from 'react';

const Dashboard: React.FC = () => {
  // ... existing code ...

  const renderMainContent = () => {
    // Assuming `error` is a state that indicates whether there is an error or not
    if (error) {
      // Render error state with a <main> element
      return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
          {/* ... error content ... */}
        </main>
      );
    } else {
      // Render success state with a <main> element
      return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
          {/* ... success content ... */}
        </main>
      );
    }
  };

  return (
    <div>
      {renderMainContent()}
      {/* ... other content ... */}
    </div>
  );
};

export default Dashboard;