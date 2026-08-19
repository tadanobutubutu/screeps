import React from 'react';

export default function MainContent() {
  return (
    <div lang="en">
      <main>
        <div className="container">
          <h2>Quality &amp; Metrics Reports</h2>
          <p>
            This repository is fully optimized with automated tools. Explore the generated
            reports below:
          </p>
          <div className="links">
            <a href="/plato-report">📊 Plato Code Complexity Report</a>
            <a href="/dependency-graph">🕸️ Dependency Graph</a>
          </div>
        </div>
      </main>
    </div>
  );
}