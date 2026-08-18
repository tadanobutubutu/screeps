// Assuming the React component looks something like this:
// (Please replace 'YourComponent' with the actual component name)
// This is just an example, and the actual code might differ.

import React from 'react';

// ... (other imports)

function YourComponent() {
  // ... (other component code)

  // Replace the anchor with a button for in-page actions
  return (
    <div>
      {/* ... other HTML */}
      <button id="unrotate" onClick={rotateBackAction}>rotate back</button>
      {/* ... other HTML */}
    </div>
  );
}

function rotateBackAction() {
  // Logic to handle the action (rotate back)
  console.log('Rotating back...');
}

// ... (other component code)

export default YourComponent;