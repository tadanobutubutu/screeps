tsx
// dashboard/app/layout.tsx
import React from 'react';

const Layout = () => {
  return (
    <div>
      <link rel="icon" href={getFavicon()} />
      {/* ... other components ... */}
    </div>
  );
};

const getFavicon = () => {
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Screeps Dashboard"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>`;
};

export default Layout;

// app/layout.tsx
import React from 'react';

const Layout = () => {
  return (
    <div>
      <link rel="icon" href={getFavicon()} />
      {/* ... other components ... */}
    </div>
  );
};

const getFavicon = () => {
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Screeps Dashboard"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>`;
};

export default Layout;