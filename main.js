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
        <title>My App</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Add aria-label or title to SVG */}
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>App Icon</title>
          {/* SVG content */}
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}