import React from 'react';

// Existing component or function definitions
function DependencyGraph() {
  // Suppose this is where the problematic link was rendered
  return (
    <html lang="en">
      <div>
        <a id="unrotate" href="#">rotate back</a>
      </div>
    </html>
  );
}

// Existing exports (must be preserved)
export default DependencyGraph;