tsx
<!-- dashboard/app/layout.tsx -->
import React from "react";

const Layout = ({ children }) => {
  return (
    <body>
      {/* existing code */}
      <main>{children}</main>
    </body>
  );
};

export default Layout;