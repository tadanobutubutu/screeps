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

// New component for the rotate back button
export function RotateBackButton({ onClick }: { onClick: () => void }) {
  return (
    <button id="unrotate" onClick={onClick}>
      rotate back
    </button>
  );
}

// New component for the dependency graph page
export function DependencyGraphPage({ children }: { children: ReactNode }) {
  return (
    <main>
      {children}
    </main>
  );
}

// New component for the docs index page
export function DocsIndexPage({ children }: { children: ReactNode }) {
  return (
    <main>
      {children}
    </main>
  );
}