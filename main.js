// main.js
import React from 'react';

/**
 * Handles the rotation back action for the dependency graph
 */
const handleRotateBack = () => {
  // Implement your rotation logic here
  console.log('Rotating back to original view');
};

// Preserve all existing exports and functions
// ... (all other existing code remains unchanged)

/**
 * Component for the dependency graph visualization
 */
const DependencyGraph = () => {
  return (
    <div className="dependency-graph">
      {/* Other graph elements */}
      <button
        id="unrotate"
        onClick={handleRotateBack}
        aria-label="Rotate back to original view"
      >
        rotate back
      </button>
    </div>
  );
};

export default DependencyGraph;