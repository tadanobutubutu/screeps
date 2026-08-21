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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Screeps</title>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Screeps Logo</title>
          {/* SVG content */}
        </svg>
      </head>
      <body>
        <header>
          <nav aria-label="Main navigation">
            {/* Navigation content */}
          </nav>
        </header>
        <main id="main-content" aria-label="Main content">
          {children}
        </main>
        <footer aria-label="Site footer">
          {/* Footer content */}
        </footer>
      </body>
    </html>
  );
}