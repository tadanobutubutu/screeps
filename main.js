// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// For app/layout.tsx
const AppLayout = ({ children }) => {
  return (
    <body className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
    </body>
  );
};

// For dashboard/app/layout.tsx
const DashboardLayout = ({ children }) => {
  return (
    <body>
      <main>{children}</main>
    </body>
  );
};

// For docs/dependency-graph.html
const DependencyGraph = () => {
  return (
    <main>
      <table id="table-rotated">
        {/* Table content */}
      </table>
    </main>
  );
};

// For docs/index.html
const DocsIndex = () => {
  return (
    <main>
      <div className="container">
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
};

// Main rendering
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);