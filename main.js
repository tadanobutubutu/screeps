// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// For _document.tsx - add lang attribute to html element
const HtmlDocument = ({ children, lang = 'en' }) => (
  <html lang={lang}>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
      {children}
    </body>
  </html>
);

// For app/layout.tsx
const AppLayout = ({ children }) => (
  <div role="banner">
    <header>
      <nav aria-label="Main navigation">
        {/* Navigation content */}
      </nav>
    </header>
    <main id="main-content" aria-label="Main content">
      {children}
    </main>
  </div>
);

// For dashboard/app/layout.tsx
const DashboardLayout = ({ children }) => (
  <div role="banner">
    <header>
      <nav aria-label="Dashboard navigation">
        {/* Dashboard navigation content */}
      </nav>
    </header>
    <main id="main-content" aria-label="Dashboard content">
      {children}
    </main>
  </div>
);

// For DependencyGraph - add proper table structure
const DependencyGraph = ({ nodes = [], links = [] }) => (
  <main id="main-content" aria-label="Dependency graph">
    <div role="region" aria-label="Dependency visualization">
      <table id="table-rotated" aria-label="Dependency relationships">
        <caption>Dependency relationship overview</caption>
        <thead>
          <tr>
            <th scope="col">Source Module</th>
            <th scope="col">Target Module</th>
            <th scope="col">Dependency Type</th>
            <th scope="col">Complexity</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node, index) => (
            <tr key={index}>
              <th scope="row">{node.source || `Module ${index + 1}`}</th>
              <td>{links[index]?.target || 'N/A'}</td>
              <td>{links[index]?.type || 'direct'}</td>
              <td>{links[index]?.weight || 1}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* SVG for graph visualization */}
      <svg 
        viewBox="0 0 800 600" 
        role="img" 
        aria-label="Dependency graph visualization"
        style={{ width: '100%', height: 'auto' }}
      >
        <title>Dependency Graph</title>
        <desc>A visual representation of project dependencies</desc>
        {/* Graph nodes and links rendered here */}
      </svg>
    </div>
  </main>
);

// For docs/index.html (converted to React component)
const DocsIndex = () => (
  <main id="main-content" aria-label="Documentation index">
    <div className="container">
      <h1>Documentation</h1>
      <div className="links">
        <a href="/reports/plato" aria-label="View Plato Code Complexity Report">
          <span aria-hidden="true">📊</span> Plato Code Complexity Report
        </a>
        <a href="/reports/dependencies" aria-label="View Dependency Graph">
          <span aria-hidden="true">🔗</span> Dependency Graph
        </a>
      </div>
    </div>
  </main>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export all existing functions and components
export { 
  AppLayout, 
  DashboardLayout, 
  DependencyGraph, 
  DocsIndex,
  HtmlDocument
};