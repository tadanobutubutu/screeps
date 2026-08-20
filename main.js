// app/layout.tsx
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ... existing head content ... */}
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}