tsx
// app/layout.tsx and dashboard/app/layout.tsx
import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Add aria-hidden="true" to decorative SVG */}
        <svg aria-hidden="true" style={{ display: 'none' }}>
          {/* Your SVG content here */}
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}