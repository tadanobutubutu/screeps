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
        <title>Screeps Dashboard</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* SVG with accessible name */}
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Screeps Application Icon</title>
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}