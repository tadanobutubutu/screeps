tsx
// dashboard/app/layout.tsx

import React from 'react';

const Layout = ({ children }) => {
  return (
    <div>
      {/* ... other components ... */}
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        role="img"
        aria-label="Icon"
      >
        <title>Icon</title>
        {/* SVG content */}
      </svg>
      {/* ... other components ... */}
      
      {/* Rotate back button - use button for in-page actions */}
      <button 
        id="unrotate" 
        type="button"
        onClick={() => {
          // Rotate back functionality
          const svg = ...
          if (svg) {
            svg.style.transform = 'rotate(0deg)';
          }
        }}
      >
        rotate back
      </button>
      
      {children}
    </div>
  );
};

export default Layout;
export { Layout };