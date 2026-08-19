// app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps game dashboard',
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
        sizes: 'any',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Screeps Dashboard Icon</title>
        </svg>
        {children}
      </body>
    </html>
  );
}