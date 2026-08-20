tsx
import React from 'react';

const Layout = ({ children }) => {
  return (
    <html lang="ja">
      <head>
        {/* ... */}
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default Layout;