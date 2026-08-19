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
        {/* Add aria-label to the SVG or make it decorative */}
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Screeps Logo</title>
        </svg>
      </head>
      <body>
        {children}
        {/* Replace the problematic link with a proper button */}
        <button id="unrotate" onClick={() => window.history.back()}>
          rotate back
        </button>
      </body>
    </html>
  );
}