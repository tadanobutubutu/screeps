// app/layout.tsx or dashboard/app/layout.tsx
import React from 'react';

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add aria-label or title for accessibility */}
        <svg
          aria-hidden="true"
          style={{ display: 'none' }}
          // Or alternatively:
          // <title>Favicon</title>
        >
          {/* SVG content */}
        </svg>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}