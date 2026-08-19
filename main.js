// main.js
import React from 'react';

const DependencyGraph = () => {
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
};

export default DependencyGraph;