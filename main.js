// app/layout.tsx
import React from 'react';
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Screeps',
  description: 'Screeps game',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Screeps</title>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Screeps Logo</title>
          {/* SVG content */}
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}