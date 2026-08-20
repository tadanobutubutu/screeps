tsx
import React from 'react';

const Layout = ({ children }) => (
  <html lang="ja">
    <head>
      {/* Existing head content */}
    </head>
    <body>
      <main>{children}</main>
    </body>
  </html>
);

export default Layout;