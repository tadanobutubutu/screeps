import React from 'react';

const Dashboard = ({ isError, data }) => {
  if (isError) {
    return (
      <div className="dashboard">
        <header>
          <h1>Dashboard</h1>
        </header>
        <section className="error-section">
          <h2>Error</h2>
          <p>Failed to load dashboard data. Please try again later.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
      </header>
      <main>
        <section className="stats-section">
          <h2>Statistics</h2>
          {/* Render stats data */}
        </section>
        <section className="data-section">
          <h2>Data Overview</h2>
          {/* Render main dashboard data */}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;