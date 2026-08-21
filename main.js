import React from 'react';

function RotateBack() {
  const handleRotateBack = () => {
    // Your existing functionality here
    console.log('Rotating back...');
  };

  return (
    <a id="unrotate" href="#" onClick={handleRotateBack}>
      rotate back
    </a>
  );
}

export default RotateBack;