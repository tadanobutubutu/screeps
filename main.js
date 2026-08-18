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
    <main className="main-content">
      {content}
    </main>
  );
}

// New component for dashboard layout
export function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        {/* Header content */}
      </header>
      <main className="dashboard-main">
        {children}
      </main>
      <footer className="dashboard-footer">
        {/* Footer content */}
      </footer>
    </div>
  );
}

// New function for documentation pages
export function DocPageLayout({ children }) {
  return (
    <div className="doc-page">
      <header className="doc-header">
        {/* Documentation header */}
      </header>
      <main className="doc-main">
        {children}
      </main>
      <footer className="doc-footer">
        {/* Documentation footer */}
      </footer>
    </div>
  );
}

// New function for dependency graph page
export function DependencyGraphPage({ children }) {
  return (
    <div className="dependency-graph-page">
      <header className="graph-header">
        {/* Graph header */}
      </header>
      <main className="graph-main">
        {children}
      </main>
    </div>
  );
}

// New component for the rotate back button
export function RotateBackButton({ onClick }) {
  return (
    <button id="unrotate" onClick={onClick} className="rotate-back-button">
      rotate back
    </button>
  );
}