// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppLayout from './app/layout';
import DashboardLayout from './dashboard/app/layout';
import DependencyGraph from './docs/dependency-graph';
import DocsIndex from './docs/index';

const AppLayout = ({ children }) => (
  <AppLayout>
    <main>
      {children}
    </main>
  </AppLayout>
);

const DashboardLayout = ({ children }) => (
  <DashboardLayout>
    <main>
      {children}
    </main>
  </DashboardLayout>
);

const DependencyGraph = () => (
  <DependencyGraph>
    <main>
      <table id="table-rotated">
        {/* Table content would go here */}
      </table>
    </main>
  </DependencyGraph>
);

const DocsIndex = () => (
  <DocsIndex>
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
  </DocsIndex>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export all existing functions and components
export { AppLayout, DashboardLayout, DependencyGraph, DocsIndex };