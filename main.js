// Assuming an existing React component structure
import React from 'react';

// Preserved existing code (e.g., imports, other components, etc.)
// ... (code that is not related to the issue)

// This is the component that contains the problematic HTML
const DependencyGraph = () => {
  // Preserved existing code within the component
  // ... (code that is not related to the issue)

  return (
    <div>
      {/* Original problematic HTML */}
      <a id="unrotate" href="#">rotate back</a>

      {/* Change to a button for in-page actions */}
      <button id="unrotate" onClick={() => {/* rotate back logic here */}}>rotate back</button>
    </div>
  );
};

// Preserved existing code (e.g., exports, etc.)
// ... (code that is not related to the issue)

export default DependencyGraph;