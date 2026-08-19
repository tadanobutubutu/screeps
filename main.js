// app/layout.tsx
import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Screeps</title>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Screeps Logo</title>
          <desc>Logo for Screeps platform</desc>
        </svg>
      </head>
      <body>
        <header role="banner">
          <h1>Screeps</h1>
        </header>
        <main role="main">
          {children}
        </main>
        <footer role="contentinfo">
          {/* Footer content would go here */}
        </footer>
      </body>
    </html>
  );
}