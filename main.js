tsx
import React from 'react';

// Existing code, keeping it as it is

const Layout = (props) => {
  // Existing function, keeping it as it is

  return (
    <main className="flex-1">
      {/* Certainly,wrap the children inside <main> */}
      {props.children}
    </main>
  );
};

export default Layout;