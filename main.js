// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code (preserved)
const App = () => {
  // ... existing app code ...
};

// Existing exports (preserved)
export { App };

// Add accessible name to SVG in app/layout.tsx
const AccessibleSVG = ({ children, ...props }) => (
  <svg {...props} aria-hidden={props['aria-hidden'] || "true"}>
    {children}
  </svg>
);

// Add accessible name to SVG in dashboard/app/layout.tsx
const DashboardAccessibleSVG = ({ children, ...props }) => (
  <svg {...props} aria-label="Favicon" aria-hidden={props['aria-hidden'] || "false"}>
    {children}
  </svg>
);

// Export the accessible SVG components
export { AccessibleSVG, DashboardAccessibleSVG };