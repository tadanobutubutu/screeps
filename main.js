import React from 'react';
import { icons } from './icons';

const contentDependencyGraph = `
<main>
    <table id="table-rotated">
        <!-- ... rest of the table content ... -->
    </table>
</main>
`;

const contentIndex = `
<main>
    <div class="container">
        <h2>Quality & Metrics Reports</h2>
        <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
        <div class="links">
            <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
            <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
        </div>
    </div>
</main>
`;

const Layout = () => {
  return (
    <div>
      {/* Other content */}
      <link rel="icon" href={icons.icon} aria-label="Screeps Dashboard" />
      {/* Other content */}
    </div>
  );
};

export function HomePage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: contentIndex }} />
      {/* ... other components ... */}
    </div>
  );
}

// Make sure to include similar <main> elements for other pages as needed.

export default Layout;
```