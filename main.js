// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Existing code remains unchanged
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// New function to handle main content rendering
export function renderMainContent(content) {
  return (
    <main className="main-content" role="main" aria-label="Main content">
      {content}
    </main>
  );
}

// New component for dashboard layout
export function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header" role="banner">
        {/* Header content */}
      </header>
      <main className="dashboard-main" role="main">
        {children}
      </main>
      <footer className="dashboard-footer" role="contentinfo">
        {/* Footer content */}
      </footer>
    </div>
  );
}

// New component for documentation pages
export function DocPageLayout({ children }) {
  return (
    <div className="doc-page">
      <header className="doc-header" role="banner">
        {/* Documentation header */}
      </header>
      <main className="doc-main" role="main">
        {children}
      </main>
      <footer className="doc-footer" role="contentinfo">
        {/* Documentation footer */}
      </footer>
    </div>
  );
}

// New function for dependency graph page
export function DependencyGraphPage({ children }) {
  return (
    <div className="dependency-graph-page">
      <header className="graph-header" role="banner">
        {/* Graph header */}
      </header>
      <main className="graph-main" role="main">
        {children}
      </main>
    </div>
  );
}