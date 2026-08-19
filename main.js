tsx
import React from 'react';

// Your existing code...

const Layout = ({ children }: any) => {
  return (
    <div className="layout">
      {/* Add main landmark */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;