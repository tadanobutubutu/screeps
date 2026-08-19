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

// For docs/dependency-graph.html
// Note: This is HTML, not JSX, so we'll need to modify the actual HTML file
// The fix would be to wrap the content in <main> tags

// For docs/index.html
// Similarly, this would need to be modified in the HTML file
// The fix would be to wrap the content in <main> tags

// Main application render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export all existing functions and components
export { AppLayout, DashboardLayout };