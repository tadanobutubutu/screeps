import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Add accessibility attributes to SVG elements
const FaviconSVG = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
  >
    {/* SVG content remains the same */}
  </svg>
);

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

// Update the root rendering
const container = document.getElementById('root');
const root = createRoot(container);

// Main application render
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export all components
export { AppLayout, DashboardLayout, DependencyGraph, DocsIndex };