// app/layout.tsx
import React from 'react';

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Screeps Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">
          {/* SVG content */}
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}