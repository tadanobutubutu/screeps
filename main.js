import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// main.js - Updated to fix REACT_036 accessibility warning

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
export const isRotated = isRotated;
export const rotateContent = function() {
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
};
export const unrotateContent = function() {
    const content = document.getElementById('content');
    if (content) {
        content.style.transform = 'rotate(0deg)';
        isRotated = false;
    }
};

/**
 * Adds accessible name to SVG elements to comply with REACT_041 rule
 * @param {React.ReactElement} svgElement - The SVG element to make accessible
 * @param {string} label - The accessible name for the SVG
 * @returns {React.ReactElement} The accessible SVG element
 */
function makeSvgAccessible(svgElement, label) {
  return React.cloneElement(svgElement, {
    'aria-label': label,
    role: 'img'
  });
}

// Layout components
const AppLayout = ({ children }) => {
  return (
    <React.StrictMode>
      <main>
        {children}
      </main>
    </React.StrictMode>
  );
};

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