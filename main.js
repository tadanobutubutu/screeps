tsx
// Assuming these files are similar and are used to wrap the application layout.
import React from 'react';

const Layout: React.FC = ({ children }) => {
  return (
    <body>
      <main>{children}</main>
    </body>
  );
};

export default Layout;