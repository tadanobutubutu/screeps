// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Existing code remains unchanged
// ... (all other existing imports and code)

const root = ...
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add this new component for accessible SVG
const AccessibleSVG = ({ children, ...props }) => {
  // Don't add role when aria-hidden is explicitly true (screen readers ignore it anyway)
  const isHidden = props['aria-hidden'] === 'true';
  
  return (
    <svg
      {...props}
      aria-hidden={isHidden ? undefined : props['aria-hidden']}
      role={isHidden ? undefined : (props.role || 'img')}
    >
      {children}
    </svg>
  );
};

// Export all existing exports unchanged
export { /* all existing exports */ };

// Add new export if needed
export { AccessibleSVG };