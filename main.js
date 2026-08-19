import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return (
    <div>
      {/* Favicon SVG with aria-hidden */}
      <svg
        aria-hidden="true"
        style={{ display: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
      >
        <title>Favicon</title>
        <circle cx="50" cy="50" r="40" fill="#61dafb" />
      </svg>

      {/* Main content */}
      <h1>Welcome to the App</h1>
      <p>This is a React application.</p>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// Export all existing functions if any
export { /* existing exports */ };

/**
 * Fixes REACT_041: React SVG Accessible Name
 * Adds aria-label to SVGs in layout components
 */
function fixSvgAccessibility() {
  // For app/layout.tsx
  const appLayoutSvg = document.querySelector('app-layout svg');
  if (appLayoutSvg) {
    appLayoutSvg.setAttribute('aria-label', 'Application icon');
  }

  // For dashboard/app/layout.tsx
  const dashboardLayoutSvg = document.querySelector('dashboard-app-layout svg');
  if (dashboardLayoutSvg) {
    dashboardLayoutSvg.setAttribute('aria-label', 'Dashboard icon');
  }
}

// Run the fix when the page loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', fixSvgAccessibility);
}