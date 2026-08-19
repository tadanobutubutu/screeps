// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// For app/layout.tsx
const AppLayout = ({ children }) => (
  <body>
    <main>
      {children}
    </main>
  </body>
);

// For dashboard/app/layout.tsx
const DashboardLayout = ({ children }) => (
  <body>
    <main>
      {children}
    </main>
  </body>
);

// For docs/dependency-graph.html
const DependencyGraph = () => (
  <html>
    <body>
      <main>
        <table id="table-rotated">
          {/* Table content */}
        </table>
      </main>
    </body>
  </html>
);

// For docs/index.html
const DocsIndex = () => (
  <html>
    <body>
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
    </body>
  </html>
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
  DocsIndex
};