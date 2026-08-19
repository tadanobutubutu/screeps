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

// Additional function to handle table structure fix
export function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', 'col');
      }
    });
  });
}

// Call the function to fix the table structure on component mount or other appropriate event
// Example: useEffect(() => { fixTableStructure(); }, []);

// Ensure to test the fix thoroughly to confirm that existing tests pass and the fix works as expected