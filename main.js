// main.js
import React from 'react';

/**
 * Component for rotating the dependency graph
 */
const DependencyGraphRotator = () => {
  const handleRotateBack = () => {
    // Implement your rotation logic here
    console.log('Rotating back to original position');
  };

  return (
    <button id="unrotate" onClick={handleRotateBack}>
      rotate back
    </button>
  );
};

// Preserve all existing exports
export const existingFunction1 = () => {
  // existing implementation
};

export const existingFunction2 = () => {
  // existing implementation
};

// Add any new exports as needed
export { DependencyGraphRotator };