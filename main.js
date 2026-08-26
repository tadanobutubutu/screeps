import React from 'react';
import { icons } from './icons';

// Assuming you have a container element with an id "container"
const Layout = () => {
  return (
    <div id="container" aria-labelledby="container-label">
      <link
        rel="icon"
        href={icons.icon}
        aria-label="Screeps Dashboard"
        aria-labelledby="container-label"
      />
      {/* Other content */}
    </div>
  );
};

// Define an ID and label for the container
const containerLabel = 'Screeps Dashboard layout';

export default Layout;