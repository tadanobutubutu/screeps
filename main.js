import React from 'react';

function DependencyGraph() {
  return (
    <div>
      {/* other content */}
      {/* Replace the fake link with a button to ensure proper keyboard and screen‑reader behaviour */}
      <button id="unrotate" onClick={() => {
        // Existing rotation logic can be placed here
        console.log('rotate back');
      }}>
        rotate back
      </button>
      {/* other content */}
    </div>
  );
}

export default DependencyGraph;