tsx
// app/layout.tsx
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div>
      {/* Existing code */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        aria-label="Screeps Dashboard Icon"
      >
        <title>Screeps Dashboard</title>
        <text y="0.9em" fontSize="90">🐛</text>
      </svg>
      {children}
    </div>
  );
};

export default Layout;

// dashboard/app/layout.tsx
import React from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div>
      {/* Existing code */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        aria-label="Screeps Dashboard Icon"
      >
        <title>Screeps Dashboard</title>
        <text y="0.9em" fontSize="90">🐛</text>
      </svg>
      {children}
    </div>
  );
};

export default DashboardLayout;