tsx
import React from 'react';

const Layout: React.FC = ({ children }) => {
  return (
    <body>
      <main>{children}</main>
    </body>
  );
};

export default Layout;