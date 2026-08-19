// DependencyGraph.js
import React from 'react';
import { useState } from 'react';

function DependencyGraph() {
  // Existing state and methods (if any)

  const [isRotated, setIsRotated] = useState(false);

  const handleRotationBack = () => {
    setIsRotated(false);
    // If there is any server-side logic or API call that needs to be executed on rotation back, add it here.
  };

  return (
    // Existing JSX code (if any)
    <button id="unrotate" onClick={handleRotationBack}>rotate back</button>
    // Rest of your JSX code (if any)
  );
}

export default DependencyGraph;