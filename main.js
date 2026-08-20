// Before the issue fix:
// Assuming this is within a React component file, e.g., `DependencyGraphComponent.js`
import React from 'react';

function DependencyGraphComponent() {
  return (
    <div>
      {/* ... other components ... */}
      <a id="unrotate" href="#">rotate back</a>
      {/* ... other components ... */}
    </div>
  );
}

export default DependencyGraphComponent;

// After the issue fix:
// The same component file `DependencyGraphComponent.js`
import React from 'react';

function DependencyGraphComponent() {
  return (
    <div>
      {/* ... other components ... */}
      {/* Replace the anchor tag with a button */}
      <button id="unrotate" onClick={() => { /* Handle the rotate back action */ }}>rotate back</button>
      {/* ... other components ... */}
    </div>
  );
}

export default DependencyGraphComponent;