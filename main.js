tsx
import React from 'react';

const favicon = (
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
);

const Layout = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto">
      {favicon}
      <main>{children}</main>
    </div>
  );
};

export default Layout;