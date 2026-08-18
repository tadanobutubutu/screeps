import React from 'react';

// Existing code, keeping it as it is

const Layout = (props) => {
  // Existing function, keeping it as it is

  return (
    <main className="flex-1" lang="en">
      {/* Added lang attribute for screen reader support */}
      <div role="main" aria-label="Main content">
        {/* Wrapped children in a div with proper ARIA roles */}
        {props.children}
      </div>
    </main>
  );
};

export default Layout;