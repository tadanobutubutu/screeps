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
    <main>{children}</main>
  </body>
);

// Function to handle the unrotate action
function handleUnrotate() {
  // Logic to rotate back to original state
  console.log('Rotating back...');
  // ... rotation logic
}

// Function to render the unrotate button (accessibility fix applied)
function renderUnrotateButton() {
  return '<button id="unrotate">rotate back</button>';
}

// Example: Initialize the unrotate functionality
function initUnrotateFeature(containerElement) {
  if (containerElement) {
    containerElement.innerHTML = renderUnrotateButton();
    const unrotateBtn = document.getElementById('unrotate');
    if (unrotateBtn) {
      unrotateBtn.addEventListener('click', handleUnrotate);
    }
  }
}

// For docs/dependency-graph.html
const DependencyGraph = () => (
  <main>
    <table id="table-rotated">
      {/* Table content */}
    </table>
  </main>
);

// For docs/index.html
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

// Main application render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export all components and functions for testing
export { AppLayout, DashboardLayout, DependencyGraph, DocsIndex };
export { handleUnrotate, renderUnrotateButton, initUnrotateFeature };