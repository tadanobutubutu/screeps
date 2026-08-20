tsx
// dashboard/app/layout.tsx
import React from 'react';

function AppLayout({ children }) {
  return (
    <body>
      <main>{children}</main>
    </body>
  );
}

export default AppLayout;