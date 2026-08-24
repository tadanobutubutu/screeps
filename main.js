tsx
// dashboard/app/layout.tsx
import React from 'react';

const DashboardLayout: React.FC = ({ children }) => {
  return (
    <div>
      {/* Other components */}
      <link rel="icon" href="/icons/icon.png" />
      {/* ... */}
    </div>
  );
};

export default DashboardLayout;

// app/layout.tsx
import React from 'react';

const AppLayout: React.FC = ({ children }) => {
  return (
    <div>
      {/* Other components */}
      <link rel="icon" href="/icons/icon.png" />
      {/* ... */}
    </div>
  );
};

export default AppLayout;