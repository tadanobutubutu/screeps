// main.js
import React from 'react';
import ReactDOM from 'react-dom/root';
import App from './App';

// For app/root.tsx
const AppLayout = ({ children }) => (
  <body lang="en" className="min-h-screen flex flex-col">
    <main role="main">{children}</main>
  </body>
);

// For dashboard/app/layout.tsx
const DashboardLayout = ({ children }) => (
  <body lang="en">
    <main role="main">{children}</main>
  </body>
);

// For ...
const DependencyGraph = () => (
  <main role="main">
    <table id="table-rotated" aria-label="Dependency graph table">
      <thead>
        <tr>
          <th scope="col"><div>src/constants.js</div></th>
          <th scope="col"><div>src/managers/roomManager.js</div></th>
          <th scope="col"><div>src/managers/spawnManager.js</div></th>
          <th scope="col"><div>src/managers/towerManager.js</div></th>
          <th scope="col"><div>src/roles/builder.js</div></th>
          {/* Additional headers with scope="col" */}
        </tr>
      </thead>
      <tbody>
        {/* Table content */}
      </tbody>
    </table>
    <button id="unrotate" className="rotate-back-btn" aria-label="Rotate table back to normal orientation">rotate back</button>
  </main>
);

// For docs/description
const DocsIndex = () => (
  <main role="main">
    <div className="container">
      <h2>Quality &amp; Metrics Reports</h2>
      <p>
        This repository is fully optimized with automated tools. Explore the generated
        reports below:
      </p>
      <div className="links">
        <a ... Code Complexity Report</a>
        <a href="/dependency-graph" aria-label="View dependency graph">Dependency Graph</a>
      </div>
    </div>
  </main>
);

// Main application render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export all components
export { AppLayout, DashboardLayout, DependencyGraph, DocsIndex };