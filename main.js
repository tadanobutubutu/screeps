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
      {children}
    </div>
  );
};

export default Layout;
export { Layout };