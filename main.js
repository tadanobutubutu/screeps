import React from 'react';
import { Layout } from './Layout'; // Import the Layout component

const App = () => {
  return (
    <div>
      <Layout />
    </div>
  );
};

// In the Layout component, modify the icons prop to include aria-hidden="true"
const Layout = ({ icons }) => {
  return (
    <div>
      {/* Assuming the icons prop is an object with keys like 'favicon' and values as SVG strings */}
      <link rel="icon" href={`data:image/svg+xml;utf8,${encodeURIComponent(icons.favicon)}`} aria-hidden="true" />
      {/* Other layout content */}
    </div>
  );
};

export { Layout };

// Update the icons in the Layout component to include aria-hidden="true" and preserve existing functionality and exports
const icons = {
  favicon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
  // ... other icons
};

module.exports = {
  Layout,
  icons // Exporting the updated icons
};