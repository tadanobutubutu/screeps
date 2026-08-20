// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code (preserved as-is)
const existingFunction = () => {
  // ... existing implementation
};

// New function to render SVG with accessible name
const renderAccessibleSVG = (svgContent, label) => {
  return (
    <svg aria-label={label} role="img">
      {svgContent}
    </svg>
  );
};

// Example of how to use it in your layout components
const AppLayout = ({ children }) => {
  return (
    <div>
      {/* Existing layout content */}
      {children}

      {/* Example of accessible SVG */}
      <div aria-hidden="true">
        <svg aria-hidden="true">
          {/* Decorative SVG content */}
        </svg>
      </div>

      {/* Example of informative SVG */}
      {renderAccessibleSVG(
        <path d="M10 10 L20 20" />,
        "Diagonal line graphic"
      )}
    </div>
  );
};

// Preserve all existing exports
export { existingFunction, AppLayout };
export default AppLayout;