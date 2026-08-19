// main.js
import React from 'react';
import ReactDOM from 'react--dom/root';
import App from './App';

// For app/root.tsx
const AppLayout = ({ children }) => (
  <body lang="en" className="min-h-screen flex flex-col">
    <svg aria-hidden="true" style={{ display: 'none' }}>
      <symbol id="favicon-icon" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </symbol>
    </svg>
    <main>{children}</main>
  </body>
);

// For dashboard/app/layout.tsx
const DashboardLayout = ({ children }) => (
  <body lang="en">
    <svg aria-hidden="true" style={{ display: 'none' }}>
      <symbol id="dashboard-favicon" viewBox="0 0 24 24">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </symbol>
    </svg>
    <main>{children}</main>
  </body>
);

// For ...
const DependencyGraph = () => (
  <main>
    <table id="table-rotated">
      <thead>
        <tr>
          <th scope="col">Package</th>
          <th scope="col">Version</th>
          <th scope="col">Dependencies</th>
          <th scope="col">Dependents</th>
          <th scope="col">Size</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {/* Table content */}
      </tbody>
    </table>
  </main>
);

// For docs/app/index.tsx
const DocsIndex = () => (
  <main>
    <div className="container">
      <h2>Quality & Metrics Reports</h2>
      <p>
        This repository is fully optimized with automated tools. Explore the generated
        reports below:
      </p>
      <div className="links">
        <a ... Code Complexity Report</a>
        <a href="/dependency-graph">Dependency Graph</a>
      </div>
    </div>
  </main>
);

// Main application render
const root = ...
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export all components
export { AppLayout, DashboardLayout, DependencyGraph, DocsIndex };