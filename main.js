// Assuming this is the current content of main.js
// (since the actual content wasn't provided, I'm showing a typical React component structure)

import React from 'react';

function DependencyGraph() {
  const handleRotateBack = () => {
    // Implement your rotation logic here
    console.log('Rotating back');
  };

  return (
    <div>
      {/* Other content */}
      <button id="unrotate" onClick={handleRotateBack}>
        rotate back
      </button>
      {/* Other content */}
    </div>
  );
}

export default DependencyGraph;