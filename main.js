// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// For app/layout.tsx
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <main className="min-h-screen flex flex-col">
      <App />
    </main>
  </React.StrictMode>
);

// For dashboard/app/layout.tsx
const dashboardRoot = ReactDOM.createRoot(document.getElementById('dashboard-root'));
dashboardRoot.render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>
);

// For docs/dependency-graph.html
// This would be handled in the HTML file directly, but if you need to modify the React component:
const graphRoot = ReactDOM.createRoot(document.getElementById('graph-root'));
graphRoot.render(
  <React.StrictMode>
    <main>
      <table id="table-rotated">
        {/* Table content */}
      </table>
    </main>
  </React.StrictMode>
);

// For docs/index.html
// This would be handled in the HTML file directly, but if you need to modify the React component:
const docsRoot = ReactDOM.createRoot(document.getElementById('docs-root'));
docsRoot.render(
  <React.StrictMode>
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
  </React.StrictMode>
);