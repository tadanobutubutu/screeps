tsx
import React from 'react';

// Existing code

const Layout = ({ children }) => {
  return (
    <body>
      <main>{children}</main> // Add this line
    </body>
  );
};

export default Layout;