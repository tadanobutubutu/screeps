tsx
// dashboard/app/layout.tsx

import React from 'react';

const Layout = ({ children }) => {
  // Determine if SVG is decorative (true) or needs an accessible name (false)
  const svgIsDecorative = false;
  
  return (
    <div>
      {/* ... other components ... */}
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        aria-hidden={svgIsDecorative ? 'true' : 'false'}
        aria-label={svgIsDecorative ? undefined : 'Icon'}
      >
        {/* SVG content */}
      </svg>
      {/* ... other components ... */}
      {children}
    </div>
  );
};

export default Layout;