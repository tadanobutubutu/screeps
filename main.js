// app/layout.tsx
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Removed the second <main> element to preserve a single <main> landmark */}
        <main>{children}</main>
      </body>
    </html>
  );
}