// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Existing code (preserved)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// New function to handle the main content wrapper
export function MainContentWrapper({ children }) {
  return (
    <main className="flex-1">
      {children}
    </main>
  );
}

// Existing exports (preserved)
export const existingFunction = () => {
  // Some existing functionality
};

// Add main landmark to dashboard layout
export function DashboardLayout({ children }) {
  return (
    <body>
      <main>
        {children}
      </main>
    </body>
  );
}

// Add main landmark to docs pages
export function DocsLayout({ children }) {
  return (
    <main>
      <div className="container">
        {children}
      </div>
    </main>
  );
}

// Add main landmark to app layout
export function AppLayout({ children }) {
  return (
    <body className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </body>
  );
}