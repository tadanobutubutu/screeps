import React from 'react';

const Layout = ({ children }) => {
  // existing code...
  return (
    <html lang="ja">
      <head>
        {/* existing head content */}
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default Layout;
export { Layout };