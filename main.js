// main.js
import React from 'react';

export const App = () => {
  // Your existing app code
  return (
    <div>
      {/* Your existing app content */}
    </div>
  );
};

// Add this function to generate accessible SVGs
export const createAccessibleSvg = (svgContent, label) => {
  return (
    <svg aria-label={label} role="img">
      {svgContent}
    </svg>
  );
};

// Example usage in your layout components
export const Layout = ({ children }) => {
  return (
    <div>
      {/* Favicon SVG with accessible name */}
      {createAccessibleSvg(
        <path d="M12 2L2 7v6l10 5 10-5v-6L12 2z" />,
        "Application favicon"
      )}

      {/* Other layout content */}
      {children}
    </div>
  );
};