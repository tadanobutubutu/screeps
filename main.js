tsx
// app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Screeps',
  description: 'Screeps game',
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
          <title>Decorative icon</title>
        </svg>
        {children}
      </body>
    </html>
  );
}