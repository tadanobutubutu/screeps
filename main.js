// main.js
import React from 'react';

/**
 * Component for rotating back functionality
 */
const RotateBackButton = ({ onClick }) => {
  return (
    <button
      id="unrotate"
      onClick={onClick}
      className="rotate-back-button"
      aria-label="Rotate back to original view"
    >
      rotate back
    </button>
  );
};

// Preserve all existing exports and functions from current main.js
// ... (all other existing code remains unchanged)

export {
  // All existing exports
  // ... (keep all existing exports)
  RotateBackButton
};