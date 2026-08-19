// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// For app/layout.tsx
export const AppLayout = ({ children }) => (
  <main>
    {children}
  </main>
);

// For dashboard/app/layout.tsx
export const DashboardLayout = ({ children }) => (
  <main>
    {children}
  </main>
);

// Import the DependencyDashboard class from the origin file
import DependencyDashboard from './DependencyDashboard';

// Render the main app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export all existing functions if any
export { /* existing exports */ };

// Export the DependencyDashboard class for external use
export { DependencyDashboard };