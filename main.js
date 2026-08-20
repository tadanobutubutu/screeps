tsx
import React from 'react';

// Original code
function Layout({ children }) {
  return <body>{children}</body>;
}

// Fixed code
function Layout({ children }) {
  return (
    <React.Fragment>
      <main>{children}</main>
    </React.Fragment>
  );
}

export default Layout;