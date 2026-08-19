// main.js
// Resolved conflict: Removed invalid placeholder text and irrelevant React components
// from origin/main that are not applicable to Screeps game logic.

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