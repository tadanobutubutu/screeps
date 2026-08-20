// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// For app/layout.tsx
const AppLayout = ({ children }) => {
  return (
    <React.StrictMode>
      <html lang="en">
        <body>
          <main>
            {children}
          </main>
        </body>
      </html>
    </React.StrictMode>
  );
};

// For dashboard/app/layout.tsx
const DashboardLayout = ({ children }) => {
  return (
    <React.StrictMode>
      <html lang="en">
        <body>
          <main>
            {children}
          </main>
        </body>
      </html>
    </React.StrictMode>
  );
};

// Main rendering
const root = ...
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export all existing functions if any
// (Preserve any existing exports from the original file)
export { AppLayout, DashboardLayout };