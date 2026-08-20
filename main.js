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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          {/* Favicon SVG content */}
        </svg>
        {children}
      </body>
    </html>
  );
}