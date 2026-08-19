// app/layout.tsx
import React from 'react';

export default function Layout({ children }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My App</title>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          {/* SVG content */}
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}

// dashboard/app/layout.tsx
import React from 'react';

export default function DashboardLayout({ children }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Dashboard</title>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          {/* SVG content */}
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}