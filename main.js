tsx
import React from 'react';

// ...

const DashboardFavicon = () => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="48"
      height="48"
      aria-hidden="true"
    >
      <title>Screeps Dashboard</title>
      <text y=".9em" font-size="90">🐛</text>
    </svg>
  </>
);

// ...

export default function Layout({ children }) {
  // ...

  return (
    <div className={cn(styles.dashboard)}>
      {/* ... */}

      <DashboardFavicon />

      {/* ... */}
    </div>
  );
}