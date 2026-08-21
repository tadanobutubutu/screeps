// Current main.js content
// ... (existing code, exports, and functions) ...

// Importing necessary modules and components
import React from 'react';

// Assuming that `rotateBack` is a function that you want to call on click
const rotateBack = () => {
  // Logic to rotate back
};

// The previous code was using an anchor tag with an empty href attribute
// Here, we replace it with a button that calls the `rotateBack` function when clicked
const DependencyGraphComponent = () => {
  return (
    <div>
      {/* ... other components ... */}
      <button id="unrotate" onClick={rotateBack}>rotate back</button>
      {/* ... other components ... */}
    </div>
  );
};

export default DependencyGraphComponent;

// ... (rest of the main.js content) ...