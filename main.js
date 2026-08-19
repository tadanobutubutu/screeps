// main.js
import React from 'react';

const RotateButton = ({ onClick }) => {
  return (
    <button
      id="unrotate"
      onClick={onClick}
      className="rotate-button"
      aria-label="Rotate back"
    >
      rotate back
    </button>
  );
};

// Preserve all existing exports and functions
// ... (rest of your existing code remains unchanged)

export {
  // ... existing exports
  RotateButton
};