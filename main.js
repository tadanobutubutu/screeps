// app/layout.tsx
import React from 'react';
import { ImageResponse } from 'next/og';

// Root layout component
export function RootLayout({
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">
          {/* SVG content */}
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}

// Dashboard layout component
export function DashboardLayout({
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">
          {/* SVG content */}
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}

// app/favicon.ts (new file for favicon SVG with accessible name)
export const size = { width: 32, height: 32 };
export const contentType = 'image/svg+xml';

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="App favicon"
      >
        <title>App favicon</title>
        <rect width="32" height="32" rx="8" fill="#3B82F6" />
        <path
          d="M8 24V8L16 20L24 8V24"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    {
      ...size,
    }
  );
}

// reusable Icon component with accessible name
export function Icon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Application logo"
    >
      <title>Application logo</title>
      <path
        d="M4 20V4L12 16L20 4V20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}