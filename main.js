tsx
// Import required components and dependencies
import React from 'react';
// ...

const Dashboard = () => {
  // Define state, functions, and variables as before...

  if (isError) {
    // Error state component, consolidate with success state for a single <main>
    return (
      <main>
        <h1>Error occurred</h1>
        {/* rest of the error state component */}
      </main>
    );
  }

  return (
    <main>
      {/* Success state component structure */}
      <div class="container">
        <h2>Quality & Metrics Reports</h2>
        <p>
          This repository is fully optimized with automated tools. Explore the generated
          reports below:
        </p>
        <div class="links">
          <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
          <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;