tsx
// Example of how to update the `app/layout.tsx` file
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div>
      {/* Other layout components */}
      <div aria-label="Screeps Dashboard Icon">
        <img src="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>" alt="Screeps Dashboard Icon" />
      </div>
      {children}
    </div>
  );
};

export default Layout;