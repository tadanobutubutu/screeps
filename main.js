// app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps game dashboard',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
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
          <title>Screeps Favicon</title>
        </svg>
        {children}
      </body>
    </html>
  );
}

// dashboard/app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps game dashboard',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
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
          <title>Screeps Favicon</title>
        </svg>
        {children}
      </body>
    </html>
  );
}