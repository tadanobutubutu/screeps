// app/layout.tsx
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

/*
 * NOTE: The HTML root element addition mentioned in the HEAD conflict
 * should be applied to the HTML file (e.g., docs/dependency-graph.html),
 * not to this JavaScript file. The current implementation already includes
 * the required <html lang="en"> and <body><main> structure above.
 */