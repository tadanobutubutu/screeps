x
// Replace this within the relevant React component file.

import React from 'react';

function DependencyGraphComponent() {
  // ... (rest of your component)

  // Example JSX replacing the anchor with a button
  return (
    <div>
      {/* ... */}
      <button id="unrotate" onClick={() => { /* handle click event */ }}>
        rotate back
      </button>
      {/* ... */}
    </div>
  );
}

export default DependencyGraphComponent;