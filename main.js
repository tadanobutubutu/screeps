// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Favicon and Metadata SVG components (from HEAD)
const FaviconSVG = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/*SVG content from HEAD branch (included for favicon)*/}
  </svg>
);

const MetadataSVG = () => (
  <svg
    aria-label="Application metadata"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* SVG content from main branch (includes MetadataSVG)*/}
  </svg>
);

// Layout components (merged from both branches)
const Layout = ({ children }) => (
  <div>
    <FaviconSVG />
    {children}
  </div>
);

const AppLayout = ({ children }) => (
  <main>
    {children}
  </main>
);

const DashboardLayout = ({ children }) => (
  <main>
    {children}
  </main>
);

// Documentation components (from origin/main)
const DependencyGraph = () => (
  <main>
    <table id="table-rotated">
      {/* Table content would go here */}
    </table>
  </main>
);

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

// React app entry point (from origin/main)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export all components
export { 
  Layout, 
  DashboardLayout, 
  FaviconSVG, 
  MetadataSVG,
  AppLayout, 
  DependencyGraph, 
  DocsIndex 
};