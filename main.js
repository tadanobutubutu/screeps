tsx
// app/layout.tsx
import React from 'react';

const Layout: React.FC = ({ children }) => {
  return (
    <html lang="ja">
      <head>
        {/* ... other head elements ... */}
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default Layout;