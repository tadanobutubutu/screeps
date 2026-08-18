// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code (preserved)
const App = () => {
  return (
    <div>
      {/* Other existing components */}
    </div>
  );
};

// Add accessible name to SVG in app/layout.tsx
const FaviconSVG = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
  >
    {/* SVG content */}
  </svg>
);

// Add accessible name to SVG in dashboard/app/layout.tsx
const DashboardFaviconSVG = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
  >
    {/* SVG content */}
  </svg>
);

// Existing exports (preserved)
export { App };
export default App;

// New exports for the accessible SVGs
export { FaviconSVG, DashboardFaviconSVG };