tsx
import React from 'react';

const Layout = () => {
  // Define a function to create an accessible SVG element
  function createAccessibleSVG(iconData, label) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>${label}</title>${iconData}</svg>`;
  }

  // Replace the SVG creation with the accessible version
  const icons = {
    icon: createAccessibleSVG('<text y="0.9em" font-size="90">🐛</text>', 'Screeps Dashboard Icon'),
    apple: createAccessibleSVG('<text y="0.9em" font-size="90">🐛</text>', 'Apple Icon')
    // ... other icons ...
  };

  // ... existing code ...
};

export default Layout;