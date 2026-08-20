tsx
// app/layout.tsx
import React from "react";

function Layout({ children }) {
  return (
    <html lang="ja">
      <head>
        {/* ... */}
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

export default Layout;

// dashboard/app/layout.tsx
import React from "react";
import { Container } from "react-bootstrap";

function Layout({ children }) {
  return (
    <html lang="ja">
      <head>
        {/* ... */}
      </head>
      <body>
        <main>
          <Container>{children}</Container>
        </main>
      </body>
    </html>
  );
}

export default Layout;