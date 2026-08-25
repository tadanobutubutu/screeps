tsx
// Assuming icons are defined or imported here
import React from 'react';
import { icons } from './icons'; // Assuming icons are exported from a separate module

const Layout = () => {
  return (
    <div>
      {/* Other content */}
      <link rel="icon" href={icons.icon} aria-label="Screeps Dashboard" />
      {/* Other content */}
    </div>
  );
};

export default Layout;