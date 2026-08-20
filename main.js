// dashboard/app/layout.tsx

import React from 'react';

const Layout = ({ children }) => {
  // Determine if the SVG is decorative
  const svgIsDecorative = false;
  
  return (
    <div>
      {/* ... other components ... */}
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        aria-hidden={svgIsDecorative ? true : false}
        aria-label="Decorative icon"
      >
        {/* SVG content */}
      </svg>
      {/* ... other components ... */}
      {children}
    </div>
  );
};

export default Layout;