// app/layout.tsx
import React from 'react';

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Screeps Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
        {/* Fixed REACT_015: Added lang attribute to SVG */}
        <svg aria-hidden="true" style={{ display: 'none' }} lang="en">
          <title>Screeps Logo</title>
        </svg>
      </head>
      <body>
        {/* Added main landmark for REACT_017 */}
        <main id="main-content" aria-label="Main Content">
          {children}
        </main>
      </body>
    </html>
  );
}