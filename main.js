// The content of main.js with the necessary changes for the issue REACT_025
// Note: This is a hypothetical example, as the actual file content is not provided.

import React from 'react';

// ... other imports and component logic ...

const Dashboard = ({ error, copied, errCopyHover, errRetryHover, refreshing, copyErr, fetchStats }) => {
  // ... existing code ...

  return (
    <div>
      {/* Assuming this is the original structure, we'll refactor it to avoid multiple <main> tags */}
      <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
        {/* ... error state content ... */}
      </main>
      <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
        {/* ... success state content ... */}
      </main>
      {/* ... rest of the component ... */}
    </div>
  );
};

// Refactored to use a single <main> and conditional rendering
const Dashboard = ({ error, copied, errCopyHover, errRetryHover, refreshing, copyErr, fetchStats }) => {
  const renderMainContent = () => {
    if (error) {
      return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
          {/* ... error state content ... */}
        </main>
      );
    } else {
      return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
          {/* ... success state content ... */}
        </main>
      );
    }
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