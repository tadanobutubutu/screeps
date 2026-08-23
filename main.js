tsx
import React from 'react';

const Layout = () => {
  // Preserve existing code...

  // Add the new button component for in-page actions
  const RotateBackButton = () => {
    return (
      <button id="unrotate" aria-label="Rotate back">
        Rotate back
      </button>
    );
  };

  // Use the new button instead of the link
  return (
    <div>
      { /* ... other content ... */}
      <RotateBackButton />
      { /* ... other content ... */}
    </div>
  );
};

export default Layout;