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
        <div lang="en">
          <main>
            <div className="container">
              <h2>Quality &amp; Metrics Reports</h2>
              <p> This repository is fully optimized with automated tools. Explore the generated reports below: </p>
              <div className="links">
                <a ... Code Complexity Report</a>
                <a href="/dependency-graph">Dependency Graph</a>
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;