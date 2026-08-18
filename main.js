// main.js
import React from 'react';
import ReactDOM from 'react-dom';

// ... (preserve all existing code and imports)

const DependencyGraph = () => {
  // ... (preserve all existing component code)

  const handleRotateBack = () => {
    // Implement your rotation logic here
    console.log('Rotating back');
  };

  return (
    <div>
      {/* ... (preserve all existing JSX) */}

      {/* Replace the fake link with a proper button */}
      <button
        id="unrotate"
        onClick={handleRotateBack}
        aria-label="Rotate back to original view"
      >
        rotate back
      </button>

      {/* ... (preserve all remaining JSX) */}
    </div>
  );
};

// ... (preserve all remaining code and exports)