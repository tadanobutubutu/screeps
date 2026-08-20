import React from 'react';

// Existing component that might be using a <a> with href="#"
const OldComponent = () => {
  return (
    <div>
      {/* Example of a non-interactive link */}
      <a id="unrotate" href="#">rotate back</a>
      {/* Other content */}
    </div>
  );
};

// New component that uses a <button> for the same purpose
const NewComponent = () => {
  return (
    <div>
      {/* Replace the <a> with a <button> */}
      <button id="unrotate" onClick={() => {/* Your action here */}}>rotate back</button>
      {/* Other content */}
    </div>
  );
};

// Export the new component as the default export
export default NewComponent;

// Any additional functions or changes go here