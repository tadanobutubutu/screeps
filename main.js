// main.js
import React from 'react';

// ... existing code ...

// Replace the problematic link with a proper button
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
      aria-label="Rotate back to original view"
    >
      rotate back
    </button>
  );
};

// ... rest of existing code ...

// Export all existing functions/components
export { /* existing exports */, RotateBackButton };