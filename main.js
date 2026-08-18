// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Existing code (preserved as-is)
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
function DashboardLayout({ children }) {
  return (
    <body>
      <main>{children}</main>
    </body>
  );
}

function MainLayout({ children }) {
  return (
    <body className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
    </body>
  );
}

// Export all existing functions (preserved as-is)
export { root, wrapInMain, DashboardLayout, MainLayout };