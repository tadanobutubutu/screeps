// main.js
import React from 'react';

// Example component containing the fix for REACT_036
const App = () => {
  return (
    <div>
      {/* Fixed: Changed <a> to <button> for proper keyboard and screen reader support */}
      <button id="unrotate" type="button">rotate back</button>
    </div>
  );
};

// Fixed: Added accessible SVG component for REACT_041
// Adds accessible name to SVG elements to fix screen reader issues
const AccessibleSVG = ({ children, ariaLabel, hidden = false, ...props }) => {
  return (
    <svg 
      role="img" 
      aria-label={ariaLabel}
      aria-hidden={hidden}
      {...props}
    >
      {children}
    </svg>
  );
};

// Helper component for decorative SVGs (aria-hidden="true")
export const DecorativeSVG = ({ children, ...props }) => {
  return (
    <svg 
      role="presentation"
      aria-hidden="true" 
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
};

export { AccessibleSVG };
export default App;