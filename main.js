import React from 'react';

const main = () => {
  return (
    <div lang="en">
      <main>
        <div className="container">
          <h2>Quality & Metrics Reports</h2>
          <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
          <div className="links">
            <a href="/code-complexity-report">Code Complexity Report</a>
            <button onClick={() => navigateTo('/dependency-graph')}>Dependency Graph</button>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper function to navigate to the given path
const navigateTo = (path) => {
  window.location.href = path;
};

export default main;