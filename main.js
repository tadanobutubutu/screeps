import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps Dashboard',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        href: '/favicon.ico',
        rel: 'icon',
        type: 'image/x-icon',
        sizes: 'any',
      },
      {
        url: '/icon.svg',
        href: '/icon.svg',
        rel: 'icon',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Favicon</title>
        </svg>
        {children}
      </body>
    </html>
  );
}