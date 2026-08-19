tsx
import React from 'react';

const Layout: React.FC = ({ children }) => {
  return (
    <body>
      {/* Existing HTML or JSX inside body */}
      <main>{children}</main>
    </body>
  );
};

export default Layout;