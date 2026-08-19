// main.js
import React from 'react';
import ReactDOM from 'react-dom/root';
import App from './App';

// For app/root.tsx
const AppLayout = ({ children }) => (
  <body lang="en" className="min-h-screen flex flex-col">
    <main className="flex-1">{children}</main>
  </body>
);

// For dashboard/app/layout.tsx
const DashboardLayout = ({ children }) => (
  <body lang="en">
    <main>{children}</main>
  </body>
);

// For dashboard/app/dependency-graph/page.tsx
const DependencyGraph = () => (
  <main>
    <table id="table-rotated">
      {/* Table content */}
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
        <a href="/dependency-graph">Plato Code Complexity Report</a>
        <a href="/dependency-graph">Dependency Graph</a>
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