import React from 'react';

function DependencyGraph() {
  return (
    <div>
      {/* Existing content */}
      <button
        id="unrotate"
        onClick={() => {/* Handle the rotate back action */}}
        aria-label="Rotate back to original view"
      >
        rotate back
      </button>
      {/* More content */}
    </div>
  );
}

export default DependencyGraph;