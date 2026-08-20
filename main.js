tsx
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div>
      <Header></Header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;