// Current state of main.js
import React from 'react';

function MyComponent() {
  // Old code that needs to be updated
  return (
    <div lang="en">
      {/* Content */}
    </div>
  );
}

export default MyComponent;

// New changes according to the issue
function updateAccessibility() {
  const container = document.querySelector('#dependencyGraph');
  if (container) {
    container.setAttribute('role', 'application');
  }
}

export { updateAccessibility };