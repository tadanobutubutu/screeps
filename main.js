// components/Dashboard.tsx
import React from 'react';

const Dashboard = ({ error, data }) => {
  if (error) {
    return (
      <div className="dashboard">
        <header>
          <h1>Dashboard</h1>
        </header>
        <main>
          <section className="error-section">
            <h2>Error</h2>
            <p>{error.message}</p>
          </section>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard">
        <header>
          <h1>Dashboard</h1>
        </header>
        <main>
          <section className="loading-section">
            <h2>Loading...</h2>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
      </header>
      <main>
        <section className="data-section">
          <h2>Data Overview</h2>
          {/* Render your data here */}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;