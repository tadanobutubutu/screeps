// Assuming the following code is in main.js or a component file that is being tested.
// This is a generic example to demonstrate the fix.

import React from 'react';

function RotateBackButton() {
  const handleRotateBack = () => {
    // Replace your logic here for when the rotate back action is triggered.
    console.log('Rotating back...');
  };

  return (
    <button id="unrotate" onClick={handleRotateBack}>
      rotate back
    </button>
  );
}

export default RotateBackButton;