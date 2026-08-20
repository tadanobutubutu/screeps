tsx
// dashboard/app/layout.tsx

import React from 'react';

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        {/* ... other head elements ... */}
      </head>
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
};

export default Layout;