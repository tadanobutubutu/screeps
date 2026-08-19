import React from 'react';

// Assuming children is a prop
function Layout({ children }) {
  return (
    <body>
      <main>{children}</main>
    </body>
  );
}

export default Layout;