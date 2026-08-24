tsx
// dashboard/app/layout.tsx and app/layout.tsx
import React from 'react';

const Layout = () => {
  const icons = {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-label=%22Screeps%20Dashboard%20Icon%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
  };

  return (
    <div>
      {/* ... other content ... */}
      <img src={icons.icon} alt="" />
      {/* ... other content ... */}
    </div>
  );
};

export default Layout;