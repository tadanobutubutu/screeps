tsx
// dashboard/app/layout.tsx
import React from 'react';

const Layout: React.FC = ({ children }) => {
  return (
    <div>
      {/* Assuming the SVG here is decorative, we can add aria-hidden="true" */}
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        {/* Your SVG content here */}
      </svg>
      {children}
    </div>
  );
};

export default Layout;