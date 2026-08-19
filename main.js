// main.js
import React from 'react';

/**
 * Handles the rotation of the dependency graph
 */
const handleRotate = () => {
  // Your existing rotation logic here
  console.log('Graph rotated');
};

/**
 * Handles the rotation back to original position
 */
const handleUnrotate = () => {
  // Your existing unrotation logic here
  console.log('Graph unrotated');
};

// Main component
const DependencyGraph = () => {
  return (
    <div className="dependency-graph">
      {/* Your existing graph rendering code */}

      {/* Updated button for better accessibility */}
      <button
        id="unrotate"
        onClick={handleUnrotate}
        aria-label="Rotate graph back to original position"
      >
        rotate back
      </button>
    </div>
  );
};

export default DependencyGraph;

// Keep all existing exports and functions
// ... (rest of your existing code)