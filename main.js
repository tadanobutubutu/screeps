tsx
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
        <svg
          aria-hidden="true"
          style={{ display: 'none' }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
        >
          <title>Screeps Logo</title>
          {/* SVG content */}
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}