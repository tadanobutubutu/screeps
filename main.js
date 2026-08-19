// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Existing code remains unchanged
// ...

// Add the following to the SVG elements in both layout files
// For app/layout.tsx and dashboard/app/layout.tsx at line 7
// The SVG should be modified to include aria-hidden="true"

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>
);

// All other existing code remains exactly as is
// ...