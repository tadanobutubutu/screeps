tsx
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ... your existing code

  return (
    <html lang="ja">
      <head>
        {/* ... head contents */}
      </head>
      <body>
        <main>{children}</main>
        {/* ... your existing code */}
      </body>
    </html>
  );
};

export default Layout;