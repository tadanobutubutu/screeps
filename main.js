import { useState } from 'react';

const DependencyGraphObject = ({ children }) => (
  <main>
    <h2>Dependency Graph</h2> {/* Added a header to the main content */}
    <table id="table-rotated">
      {/* Existing table content */}
    </table>
    {children}
  </main>
);

const IndexObject = ({ children }) => (
  <main>
    <h2>Quality & Metrics Reports</h2> {/* Added a header to the main content */}
    <div class="container">
      <p>
        This repository is fully optimized with automated tools. Explore the generated
        reports below:
      </p>
      <div class="links">
        <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
        <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
      </div>
    </div>
    {children}
  </main>
);