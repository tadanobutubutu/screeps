tsx
import React from "react";

const Layout = ({ children }) => {
  return (
    <body className="min-h-screen flex flex-col">
      <main>{children}</main>
    </body>
  );
};

export default Layout;