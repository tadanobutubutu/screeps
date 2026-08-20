tsx
import React from "react";

const AppLayout = ({ children }) => (
  <html lang="ja">
    <head>
      ...
    </head>
    <body>
      <main>{children}</main>
    </body>
  </html>
);

export default AppLayout;