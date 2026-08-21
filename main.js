tsx
import React from 'react';
import { Children } from 'react';

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        {/* ... head content ... */}
      </head>
      <body>
        <main>{Children.only(children)}</main>
      </body>
    </html>
  );
};

export default Layout;