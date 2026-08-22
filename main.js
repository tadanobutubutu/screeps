tsx
// components/Dashboard.tsx
import React from 'react';

// ... existing imports

const Dashboard = () => {
  // ... existing code

  if (error) {
    return (
      <>
        <main>
          {/* Render error content here */}
        </main>
      </>
    );
  }

  if (success) {
    return (
      <>
        <main>
          {/* Render success content here */}
        </main>
      </>
    );
  }

  // If neither error nor success, return empty main for accessibility
  return <main aria-hidden="true" />;
};

export default Dashboard;