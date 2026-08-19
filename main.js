tsx
import React from 'react';

const Layout = ({ children }) => {
  return (
    <body>
      <main>{children}</main>
      <svg aria-hidden="true" style={{ display: 'none' }} />
    </body>
  );
};

export default Layout;