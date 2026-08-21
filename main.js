// Example before changes (assuming the anchor tag is within a component):
// <a id="unrotate" href="#">rotate back</a>

// Example after changes (assuming the anchor tag is within a component):
// <button id="unrotate" onclick="rotateBack()">rotate back</button>

import React from 'react';

// Assuming this is a functional component
function DependencyGraphComponent() {
  // Function to handle the rotate back action
  const rotateBack = () => {
    // Add the logic to handle the "rotate back" action here
    // This might involve state updates or other component logic
    console.log('Rotating back...');
  };

  return (
    <div>
      {/* Updated HTML element using a button */}
      <button id="unrotate" onClick={rotateBack}>rotate back</button>
    </div>
  );
}

export default DependencyGraphComponent;