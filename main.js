=========================================
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardData } from '../lib/api';
import { DashboardData } from '../types/dashboard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import DashboardContent from './DashboardContent';

// For app/root.tsx, dashboard/app/layout.tsx, docs/app/index.tsx
const AppLayout = ({ children }) => (
  <body lang="en" className="min-h-screen flex flex-col main">
    <main role="main">{children}</main>
  </body>
);

// For dashboard/app/dependency-graph/page.tsx
const DependencyGraph = () => {
  const [rotate, setRotate] = useState(false);
  const handleRotateBack = () => setRotate(false);
  return (
    <main role="main">
      <table id="table-rotated" aria-label="Dependency graph table">
        {/* Table content */}
      </table>
      {rotate ? (
        <button id="unrotate" className="rotate-back-button" onClick={handleRotateBack}>
          rotate back
        </button>
      ) : (
        <a id="unrotate" href="#">rotate back</a>
      )}
    </main>
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

// For app/root.tsx
const AppLayout = ({ children }) => (
  <div lang="en">
    <body lang="en" className="min-h-screen flex flex-col">
      <main>{children}</main>
      {/* Footer content */}
    </body>
  </div>
);

// For docs/app/index.tsx
const DocsIndex = () => (
  <div lang="en">
    <main>
      <div className="container">
        <h2>Quality & Metrics Reports</h2>
        <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
        <div className="links">
          <a href="/code-complexity-report">Code Complexity Report</a>
          <a href="/dependency-graph">Dependency Graph</a>
        </div>
      </div>
    </main>
  </div>
);

// Main application render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export all components
export {
  AppLayout,
  DashboardLayout,
  DependencyGraph,
  DocsIndex,
};
```