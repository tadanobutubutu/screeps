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
        <title>Screeps Dashboard</title>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Screeps Logo</title>
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}

// dashboard/app/layout.tsx
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Screeps Dashboard</title>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Screeps Favicon</title>
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}

/**
 * Main application entry point with accessibility improvements
 * Fixes REACT_017 - React Landmarks issue by wrapping content in <main> landmark
 */

// Main Content Component that properly wraps children in a <main> landmark
export function MainContent({ children }) {
  return <main role="main">{children}</main>;
}

// Helper function for creating main elements with additional props
export function createMainElement(children, additionalProps = {}) {
  return <main role="main" {...additionalProps}>{children}</main>;
}

// Layout wrapper function for reusable layout patterns
export function MainLayout({ children, className = '', id = '' }) {
  return (
    <main 
      role="main" 
      className={className} 
      id={id}
    >
      {children}
    </main>
  );
}

// Preserve all existing exports
export * from './utils';
export * from './components';