// app/layout.tsx
import React from 'react';

const AppLayout = () => {
  return (
    // ... (existing code)
    <div>
      {/* Add aria-hidden="true" to the favicon SVG */}
      <link
        rel="icon"
        type="image/svg+xml"
        href=".../assets/favicon.svg"
      />
      {/* ... (existing code) */}
    </div>
  );
};

export default AppLayout;