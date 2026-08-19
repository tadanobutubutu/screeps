import React from 'react';

const Dashboard = ({ error, data }) => {
  return (
    <div lang="en">
      <main>
        <div className="container">
          {error ? (
            <div className="error-state">
              <h2>Error Loading Dashboard</h2>
              <p>We encountered an issue loading your dashboard. Please try again later.</p>
            </div>
          ) : (
            <>
              <h2>Quality & Metrics Reports</h2>
              <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
              <div className="links">
                <a href="/code-complexity">Code Complexity Report</a>
                <a href="/dependency-graph">Dependency Graph</a>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;