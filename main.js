tsx
import React from 'react';

const Layout = ({ children }) => {
  return (
    <body>
      <main>{children}</main>
    </body>
  );
};

export default Layout;