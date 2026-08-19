// dashboard/components/Dashboard.tsx
import React from 'react';

const Dashboard = ({ error, data }) => {
  if (error) {
    return (
      <div className="dashboard-error">
        <h1>Error</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <section className="dashboard-content">
        {/* Dashboard content here */}
      </section>
    </div>
  );
};

export default Dashboard;