tsx
import React from 'react';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="ja">
      <head>
        {/* Your existing head content */}
      </head>
      <body>
        <main id="main-content">{children}</main>
        {/* Your existing body content */}
      </body>
    </html>
  );
};

export default AppLayout;