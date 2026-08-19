// components/Dashboard.tsx
import React from 'react';

const Dashboard: React.FC = () => {
  // ... existing code ...

  if (error) {
    return (
      <div className="dashboard-error">
        <h1>Error</h1>
        <p>{error.message}</p>
        {/* Changed from <main> to <section> */}
        <section className="error-content">
          {/* Error content */}
        </section>
      </div>
    );
  }

  // Changed from <main> to <section> in the success path
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <section className="dashboard-content">
        {/* Dashboard content */}
      </section>
    </div>
  );
};

export default Dashboard;