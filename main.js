// app/layout.tsx
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>Screeps Dashboard</title>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Screeps Favicon</title>
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}

// dashboard/app/layout.tsx
import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>Screeps Dashboard</title>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Screeps Dashboard Favicon</title>
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}