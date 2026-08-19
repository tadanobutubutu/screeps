// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// For app/layout.tsx
const AppLayout = ({ children }) => (
  <body className="min-h-screen flex flex-col">
    <main className="flex-1">{children}</main>
  </body>
);

// For dashboard/app/layout.tsx
const DashboardLayout = ({ children }) => (
  <body>
    <main role="main">{children}</main>
  </body>
);

// For docs/dependency-graph.html
const DependencyGraph = () => (
  <main role="main" aria-labelledby="dependency-graph-title">
    <h1 id="dependency-graph-title" className="sr-only">Dependency Graph</h1>
    <table id="table-rotated" aria-label="Dependency graph visualization">
      {/* Table content */}
    </table>
  </main>
);

// For docs/index.html
const DocsIndex = () => (
  <main role="main" aria-labelledby="docs-index-title">
    <div className="container">
      <h1 id="docs-index-title" className="sr-only">Documentation Index</h1>
      <h2>Quality & Metrics Reports</h2>
      <p>
        This repository is fully optimized with automated tools. Explore the generated
        reports below:
      </p>
      <div className="links">
        <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
        <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
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