tsx
// dashboard/app/layout.tsx

import React from 'react';

const Layout = ({ children }) => {
  return (
    <div>
      {/* ... other components ... */}
      {/* Add aria-hidden="true" to the SVG if it's decorative and not meant to be read by screen readers */}
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden={svgIsDecorative ? 'true' : 'false'}>
        {/* SVG content */}
        {/* Update this condition to true if the SVG element is decorative */}
        let svgIsDecorative = false;
      </svg>
      {/* ... other components ... */}
      {children}
    </div>
  );
};

export default Layout;