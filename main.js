// ... (Preserve existing code above this point)

// Update the SVG for the favicon in app/layout.tsx
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div>
      {children}
      {/* Updated SVG with aria-label */}
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>"
        aria-label="Screeps Dashboard Logo"
      />
    </div>
  );
};

export default Layout;

// ... (Preserve existing code below this point)

// Update the SVG for the favicon in dashboard/app/layout.tsx
import React from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div>
      {children}
      {/* Updated SVG with aria-label */}
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>"
        aria-label="Screeps Dashboard Logo"
      />
    </div>
  );
};

export default DashboardLayout;

// ... (Preserve existing code below this point)