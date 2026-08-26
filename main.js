tsx
// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps Dashboard',
  icons: {
    icon: {
      url: 'data:image/svg+xml,...<svg aria-hidden="true" ...',
      type: 'image/svg+xml',
    },
    apple: {
      url: 'data:image/svg+xml,...<svg aria-hidden="true" ...',
      type: 'image/svg+xml',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}