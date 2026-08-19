// app/layout.tsx
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header role="banner">
          <h1>Application Title</h1>
        </header>
        <main role="main" id="main-content">
          {children}
        </main>
        <footer role="contentinfo">
          <p>Footer content</p>
        </footer>
      </body>
    </html>
  );
}