// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';

// Existing code (preserved)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// New function to wrap content in main landmark
function wrapInMain(content) {
  return <main>{content}</main>;
}

// Updated layout components with main landmarks
function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <header>App Header</header>
      <main>{children}</main>
      <footer>App Footer</footer>
    </div>
  );
}

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <header>Dashboard Header</header>
      <main>{children}</main>
      <footer>Dashboard Footer</footer>
    </div>
  );
}

// Export all existing functions
export { wrapInMain, AppLayout, DashboardLayout };