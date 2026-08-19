// app/layout.tsx
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Decorative element</title>
        </svg>
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

// New component for the rotate back button
export function RotateBackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      id="unrotate"
      onClick={onClick}
      aria-label="Rotate back to original orientation"
    >
      rotate back
    </button>
  );
}