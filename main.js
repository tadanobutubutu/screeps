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

// New component for the dependency dashboard
export function DependencyDashboard() {
  return (
    <div className="dependency-dashboard">
      <h2>Dependency Dashboard</h2>
      <div className="dashboard-content">
        {/* Dashboard content will be added here */}
      </div>
    </div>
  );
}