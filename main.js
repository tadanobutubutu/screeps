// main.js - Updated to fix REACT_036 accessibility warning
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize rotation state
let isRotated = false;

// Handle rotate button click
document.getElementById('rotate').addEventListener('click', function() {
    const content = document.getElementById('content');
    if (isRotated) {
        content.style.transform = 'rotate(0deg)';
        isRotated = false;
    } else {
        content.style.transform = 'rotate(90deg)';
        isRotated = true;
    }
});

// Handle unrotate button click (using button element for accessibility)
document.getElementById('unrotate').addEventListener('click', function() {
    const content = document.getElementById('content');
    content.style.transform = 'rotate(0deg)';
    isRotated = false;
});

// Sample content
const content = document.getElementById('content');
if (content) {
    content.innerHTML = `
        <h1>Welcome to the App</h1>
        <p>Click the rotate button to rotate the content.</p>
        <button id="rotate">Rotate</button>
        <button id="unrotate">rotate back</button>
    `;
}

// Export for testing
module.exports = {
    isRotated,
    rotateContent: function() {
        const content = document.getElementById('content');
        if (content) {
            if (isRotated) {
                content.style.transform = 'rotate(0deg)';
                isRotated = false;
            } else {
                content.style.transform = 'rotate(90deg)';
                isRotated = true;
            }
        }
    },
    unrotateContent: function() {
        const content = document.getElementById('content');
        if (content) {
            content.style.transform = 'rotate(0deg)';
            isRotated = false;
        }
    }
};

// For app/layout.tsx
const AppLayout = ({ children }) => {
  return (
    <React.StrictMode>
      <main>
        {children}
      </main>
    </React.StrictMode>
  );
};

// For dashboard/app/layout.tsx
const DashboardLayout = ({ children }) => {
  return (
    <React.StrictMode>
      <main>
        {children}
      </main>
    </React.StrictMode>
  );
};

// For docs/dependency-graph.html
// This would be handled in the HTML file directly, but if you need to modify the React component:
const DependencyGraph = () => {
  return (
    <main>
      <table id="table-rotated">
        {/* table content */}
      </table>
    </main>
  );
};

// For docs/index.html
// This would be handled in the HTML file directly, but if you need to modify the React component:
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

// Export all components for testing
export {
  AppLayout,
  DashboardLayout,
  DependencyGraph,
  DocsIndex
};