import React from 'react';

function DependencyGraph() {
  const handleRotateBack = () => {
    // Implement the rotate back functionality here
    // This could include any state changes or DOM manipulations needed
  };

  return (
    <div>
      {/* Existing content */}
      <button id="unrotate" onClick={handleRotateBack}>rotate back</button>
      {/* More content */}
    </div>
  );
}

export default DependencyGraph;