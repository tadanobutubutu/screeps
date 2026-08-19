// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// For app/layout.tsx
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <main className="min-h-screen flex flex-col">
      <App />
    </main>
  </React.StrictMode>
);

// For dashboard/app/layout.tsx
const dashboardRoot = ReactDOM.createRoot(document.getElementById('dashboard-root'));
dashboardRoot.render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>
);

// For docs/dependency-graph.html and docs/index.html
// These would be handled in the HTML files directly as shown in the issue
// No changes needed in main.js for these as they're static HTML files