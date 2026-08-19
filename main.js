// main.js
import React from 'react';
import ReactDOM from 'react-dom/root';
import App from './App';

// For app/root.tsx
const AppLayout = ({ children }) => (
  <div lang="en">
    <body lang="en" className="min-h-screen flex flex-col">
      <main>{children}</main>
    </body>
  </div>
);

// For dashboard/app/layout.tsx
const DashboardLayout = ({ children }) => (
  <div lang="en">
    <body lang="en">
      <main>{children}</main>
    </body>
  </div>
);

// For ...
const DependencyGraph = () => (
  <div lang="en">
    <main>
      <table id="table-rotated">
        {/* Table content */}
      </table>
    </main>
  </div>
);

// For docs/app/index.tsx
const DocsIndex = () => (
  <div lang="en">
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
  </div>
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