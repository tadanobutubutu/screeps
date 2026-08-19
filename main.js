// app/layout.tsx
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Screeps</title>
        <link rel="icon" href="/favicon.ico" />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">
          <title>Screeps Logo</title>
          {/* SVG content */}
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}