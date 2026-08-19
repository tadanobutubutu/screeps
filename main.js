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

// For dashboard/app/layout.tsx and docs/description
const Layout = ({ children, isDashboard = false }) => {
  return (
    <div lang="en">
      <main role="main">
        {isDashboard ? (
          <div className="container">
            <h2>Quality &amp; Metrics Reports</h2>
            <p>
              This repository is fully optimized with automated tools. Explore the generated
              reports below:
            </p>
            <div className="links">
              <a href="/dependency-graph" aria-label="View dependency graph">Dependency Graph</a>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
};

// For dashboard/app/layout.tsx
const DashboardLayout = ({ children }) => Layout({ children, isDashboard: true });

// For docs/description
const DocsIndex = () => Layout({ children: <></> });

// For ...
const DependencyGraph = () => (
  <main role="main">
    <table id="table-rotated" aria-label="Dependency graph table">
      {/* Table content */}
    </table>
    <button id="unrotate" className="rotate-back-btn" aria-label="Rotate table back to normal orientation">rotate back</button>
  </main>
);

// Main application render
const root = ...;
root.render(
  <React.StrictMode>
    <Layout>
      <App />
    </Layout>
  </React.StrictMode>
);

// Export all components
export { AppLayout, DashboardLayout, DependencyGraph, DocsIndex };