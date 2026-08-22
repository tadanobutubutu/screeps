// dashboard/app/layout.tsx

import React from 'react';

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <main>
        {/* ... other components ... */}
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          role="img"
          focusable="false"
          ...
        >
          <title id="svg-title-icon">Icon description</title>
          {/* SVG content */}
        </svg>
        {/* ... other components ... */}
        {children}
        {/* Adding a button for the 'rotate back' action */}
        <button id="unrotate" onClick={() => {/* Rotate back logic here */}}>rotate back</button>
      </main>
    </html>
  );
};

const getIconDescription = () => {
  // Placeholder for function logic
  return "Default icon description";
};

// Existing exports
export default Layout;
export { getIconDescription };
export const metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps Dashboard',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
  },
};