// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// For app/layout.tsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <main className="min-h-screen flex flex-col">
      <App />
    </main>
  </React.StrictMode>
);

// For dashboard/app/layout.tsx
ReactDOM.createRoot(document.getElementById('dashboard-root')).render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>
);

// For docs/dependency-graph.html
// This would be handled in the HTML file directly, but if you need to modify the React component:
const DependencyGraph = () => (
  <main>
    <table id="table-rotated">
      {/* table content */}
    </table>
  </main>
);

// For docs/index.html
// This would be handled in the HTML file directly, but if you need to modify the React component:
const DocsIndex = () => (
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

// All existing exports remain unchanged
export { someExistingFunction, anotherExistingFunction };