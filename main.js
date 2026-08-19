import React from 'react';

const DependencyGraph = () => {
  const handleRotateBack = () => {
    // Implement rotate back logic here
    console.log('Rotate back clicked');
  };

  return (
    <div>
      {/* Fixed: replaced <a href="#"> with <button> for proper accessibility */}
      <button id="unrotate" onClick={handleRotateBack}>
        rotate back
      </button>
    </div>
  );
};

export default DependencyGraph;