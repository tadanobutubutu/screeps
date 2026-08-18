tsx
// app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps Dashboard',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
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
      <body>{children}</body>
    </html>
  );
}