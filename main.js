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
    <button
      id="unrotate"
      onClick={onClick}
      aria-label="Rotate back to original orientation"
    >
      rotate back
    </button>
  );
}

// Note: The actual table header fixes would be made in the dependency-graph.html file,
// but since that's not part of the current main.js content, I'm preserving all existing
// code as requested.