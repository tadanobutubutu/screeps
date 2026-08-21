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
        aria-labelledby="svg-icon-title"
        aria-label="Icon"
        focusable="false"
      >
        <title id="svg-icon-title">Icon</title>
        {/* SVG content */}
      </svg>
      {/* ... other components ... */}
      {children}
    </div>
  );
};

export default Layout;