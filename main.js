// components/Dashboard.tsx
import React from 'react';

const Dashboard = ({ isError, children }) => {
  // ... existing code ...

  return (
    <div className="dashboard-container">
      {isError ? (
        <div className="error-state">
          {/* Error content */}
        </div>
      ) : (
        <main className="success-state">
          {/* Success content */}
          {children}
        </main>
      )}
    </div>
  );
};

export default Dashboard;