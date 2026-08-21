tsx
// dashboard/app/layout.tsx
import React from 'react';

const DashboardLayout = () => {
  return (
    <div>
      {/* Add an aria-label to the SVG element */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        aria-label="Screeps Dashboard"
      >
        <title>Screeps Dashboard</title>
        <text y="0.9em" fontSize="90">🐛</text>
      </svg>
      {/* ... rest of the dashboard content */}
    </div>
  );
};

export default DashboardLayout;

// app/layout.tsx
import React from 'react';

const AppLayout = () => {
  return (
    <div>
      {/* Add an aria-label to the SVG element */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        aria-label="App Favicon"
        style={{ display: 'none' }} // Hide the SVG if it's not decorative
      >
        <title>App Favicon</title>
        <text y="0.9em" fontSize="90">🐛</text>
      </svg>
      {/* ... rest of the app content */}
    </div>
  );
};

export default AppLayout;