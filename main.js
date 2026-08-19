// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// For app/layout.tsx
const AppLayout = ({ children }) => (
  <main>
    {children}
  </main>
);

// For dashboard/app/layout.tsx
const DashboardLayout = ({ children }) => (
  <main>
    {children}
  </main>
);

// For docs/dependency-graph.html (would need to be modified in the HTML file)
// Note: This would typically be done in the HTML file itself, not in JavaScript

// For docs/index.html (would need to be modified in the HTML file)
// Note: This would typically be done in the HTML file itself, not in JavaScript

// Main application render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export all existing functions and components
export { AppLayout, DashboardLayout };
// Add any other existing exports here