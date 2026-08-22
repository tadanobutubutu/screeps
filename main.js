import React from 'react';

// Hypothetical component for dependency-graph.html
const DependencyGraphPage = () => {
  return (
    <div>
      {/* Other header and non-primary content */}
      <main>
        <table id="table-rotated">
          {/* Primary content */}
        </table>
      </main>
      {/* Other non-primary content */}
    </div>
  );
};

// Hypothetical component for index.html
const HomePage = () => {
  return (
    <div>
      {/* Other header and non-primary content */}
      <main>
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
      {/* Other non-primary content */}
    </div>
  );
};

export { DependencyGraphPage, HomePage };