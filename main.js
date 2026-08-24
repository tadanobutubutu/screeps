// dashboard/app/layout.tsx
import React from 'react';

const Layout: React.FC = ({ children }) => {
  return (
    <div>
      {/* ... other components ... */}
      <link rel="icon" ... ... />
      <svg
        ...
        viewBox="0 0 100 100"
        aria-label="Screeps Dashboard"
      >
        <title>Screeps Dashboard</title>
        <text y="0.9em" ...
      </svg>
      {/* ... other components ... */}
      {children}
    </div>
  );
};

export default Layout;

// app/layout.tsx
import React from 'react';

const AppLayout: React.FC = ({ children }) => {
  return (
    <div>
      {/* ... other components ... */}
      <link rel="icon" ... ... />
      <svg
        ...
        viewBox="0 0 100 100"
        aria-label="Screeps Dashboard"
      >
        <title>Screeps Dashboard</title>
        <text y="0.9em" ...
      </svg>
      <svg
        ...
        viewBox="0 0 100 100"
        aria-label="Screeps Apple Icon"
      >
        <title>Screeps Apple Icon</title>
        <text y="0.9em" ...
      </svg>
      {/* ... other components ... */}
      {children}
    </div>
  );
};

export default AppLayout;