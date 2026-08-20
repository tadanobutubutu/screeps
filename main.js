tsx
// dashboard/app/layout.tsx

import React from 'react';

const Layout = () => {
  return (
    <div>
      {/* Other content */}
      <svg
        aria-hidden="true" // This makes the SVG decorative and not announced by screen readers
        viewBox="0 0 100 100"
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* SVG content */}
      </svg>
      {/* Other content */}
    </div>
  );
};

export default Layout;