import React, { useState } from 'react';
import ReactDOM from 'react-dom';

/* Example before refactor (hypothetical, not from the actual codebase)
<div>
  <a id="unrotate" href="#">rotate back</a>
</div>
*/

/* Refactored code using a button
<div>
  <button id="unrotate" onclick="rotateBack()">rotate back</button>
</div>
*/

/* Example of a function that could be called when the button is clicked */
function rotateBack() {
  // Code to rotate back, which may involve manipulating the page state or navigating
  // This function should be adjusted according to the actual functionality you want
  console.log('Rotating back...');
  // Additional logic here
}

/* React component for dependency graph with rotate functionality */
function DependencyGraph() {
  const [isRotated, setIsRotated] = useState(false);

  function handleRotate() {
    setIsRotated(!isRotated);
    // Original navigation logic replaced with button click handling
  }

  return (
    <div>
      {/* Original link replaced with button */}
      <button
        id="unrotate"
        onClick={handleRotate}
        aria-label="Rotate back"
        // Preserve any existing classes/styles
      >
        rotate back
      </button>
    </div>
  );
}

export default DependencyGraph;
export { rotateBack };