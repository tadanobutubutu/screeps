tsx
// Assuming this is the content of layout.tsx before the modification
// <body>{children}</body>

// The modified content
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <body>
      {/* Wrap the primary content in a <main> tag */}
      <main>{children}</main>
    </body>
  );
};

export default Layout;