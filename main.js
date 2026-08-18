// main.js
import React from 'react';

/**
 * Component for rotating back functionality
 */
const RotateBackButton = () => {
  const handleRotateBack = (e) => {
    e.preventDefault();
    // Add your rotation logic here
    console.log('Rotating back');
  };

  return (
    <button
      id="unrotate"
      onClick={handleRotateBack}
      aria-label="Rotate back"
    >
      rotate back
    </button>
  );
};

// Preserve all existing exports and functions from the original main.js
// ... (all other existing code remains unchanged)

export {
  // Existing exports
  // ... (all other existing exports remain unchanged)
  RotateBackButton
};