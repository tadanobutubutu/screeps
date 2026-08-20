import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code (preserved)
const App = () => {
  // ... existing app code ...
};

// Existing exports (preserved)
export { App };

// Add this new component for accessible SVG
const AccessibleSVG = ({ children, ...props }) => {
  return (
    <svg
      aria-hidden={props['aria-hidden'] || "true"}
      {...props}
    >
      {children}
    </svg>
  );
};

// Update the layout component to use accessible SVG
const Layout = ({ children }) => {
  return (
    <div>
      {/* Favicon SVG with accessibility attributes */}
      <AccessibleSVG
        aria-hidden="true"
        viewBox="0 0 100 100"
        style={{ width: 0, height: 0, position: 'absolute' }}
      >
        <title>Favicon</title>
        {/* SVG content */}
      </AccessibleSVG>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
};

// Export the updated Layout component
export { Layout };