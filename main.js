// main.js - React component to handle rotate/rotate-back functionality

import React, { useState } from 'react';
import ReactDOM from 'react-dom';

// Sample component that demonstrates the fix for REACT_036
function App() {
  const [isRotated, setIsRotated] = useState(false);

  const handleRotate = () => {
    setIsRotated(true);
  };

  const handleRotateBack = () => {
    setIsRotated(false);
  };

  return (
    <div>
      <div
        id="image-container"
        style={{
          transform: isRotated ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }}
      >
        <img src="/sample-image.png" alt="Sample" />
      </div>

      {/* Fixed: Changed from <a href="#"> to <button> for accessibility */}
      <button id="unrotate" onClick={handleRotateBack}>
        rotate back
      </button>

      <button id="rotate" onClick={handleRotate}>
        rotate
      </button>
    </div>
  );
}

export { App, handleRotate, handleRotateBack };