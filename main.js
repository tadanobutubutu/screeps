tsx
import React from 'react';
// ... existing imports ...

const AppLayout = ({ children }) => {
  return (
    <html lang="ja">
      <head>
        // ... existing head content ...
      </head>
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
};

export default AppLayout;