tsx
// Assuming the file structure is as follows:
// - app/layout.tsx
// - dashboard/app/layout.tsx

// app/layout.tsx
import React from 'react';

const Layout = () => {
  return (
    <div>
      {/* ... other components ... */}
      <link rel="icon" href="/icons/icon.svg" aria-label="Screeps Dashboard Icon" />
      {/* ... other components ... */}
    </div>
  );
};

export default Layout;

// dashboard/app/layout.tsx
import React from 'react';

const DashboardLayout = () => {
  return (
    <div>
      {/* ... other components ... */}
      <link rel="icon" href="/icons/icon.svg" aria-label="Screeps Dashboard Icon" />
      {/* ... other components ... */}
    </div>
  );
};

export default DashboardLayout;