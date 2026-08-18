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
        <title>Screeps</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Add aria-hidden to the SVG favicon */}
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Screeps Favicon</title>
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}