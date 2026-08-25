// Import the required library
import React from 'react';

const SvgIcon = (props) => (
  <svg
    {...props}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 100 100"
    aria-hidden="true"
  >
    <title>Screeps Dashboard</title>
    <text y=".9em" font-size="90">🐛</text>
  </svg>
);

const DashboardIcon = (props) => (
  <div aria-label="Screeps Dashboard Icon">
    <SvgIcon width={100} height={100} />
  </div>
);

// Export the updated DashboardIcon
export default DashboardIcon;