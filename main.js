// app/layout.tsx
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" aria-hidden="true" />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}