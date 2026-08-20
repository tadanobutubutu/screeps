tsx
// app/layout.tsx
import React from 'react';

export default function Layout({ children }) {
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>My App</title>
      </head>
      <body>
        {/* Add aria-hidden="true" to decorative SVG */}
        <svg aria-hidden="true" style={{ display: 'none' }}>
          {/* SVG content */}
        </svg>
        {children}
      </body>
    </html>
  );
}

// dashboard/app/layout.tsx
import React from 'react';

export default function DashboardLayout({ children }) {
  return (
    <div>
      {/* Add aria-label or title element to meaningful SVG */}
      <svg aria-label="Dashboard icon" style={{ width: '24px', height: '24px' }}>
        {/* SVG content */}
      </svg>
      {children}
    </div>
  );
}