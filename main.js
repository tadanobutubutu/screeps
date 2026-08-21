import * as client from 'next/font/client';
import './globals.css';

export const metadata = {
  title: 'Screeps Dashboard',
  description: 'A dashboard for Screeps game',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' aria-label='Screeps Dashboard'%3E%3Ctext y='.9em' font-size='90' x='50%25' text-anchor='middle'%3E%F0%9F%93%8A%3C/text%3E%3C/svg%3E"
        />
      </head>
      <body className={client.inter.className}>{children}</body>
    </html>
  );
}