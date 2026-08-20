// Assuming the original main.js looks something like this:
// import Layout from './layout';
// export default Layout;

// We will modify the Layout component import and export here.

// Update Layout component with accessibility fix
import React from 'react';

// Original Layout component
const Layout = ({ children }) => {
  // ... other props and logic

  return (
    // Assuming there are SVG elements within the Layout component
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <text y="0.9em" font-size="90">🐛</text>
      </svg>
      {/* Other components and content */}
    </div>
  );
};

// Modified Layout component with accessibility fix
const AccessibleLayout = ({ children }) => {
  // ... other props and logic

  return (
    <div>
      {/* Assuming the SVG is decorative and we want to hide it from assistive technology */}
      <div aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <text y="0.9em" font-size="90">🐛</text>
        </svg>
      </div>
      {/* Other components and content */}
    </div>
  );
};

// Update the export to reflect the new component name
export default AccessibleLayout;