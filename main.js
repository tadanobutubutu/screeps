// main.js - React component with accessibility fix

import React, { useState } from 'react';

function RotatableImage() {
  const [rotation, setRotation] = useState(0);

  const handleUnrotate = () => {
    setRotation(0);
  };

  return (
    <div className="image-container">
      <img 
        src="/path/to/image.jpg" 
        alt="Description of image"
        style={{ transform: `rotate(${rotation}deg)` }}
      />
      
      {/* Fixed: Use button instead of anchor with href="#" for in-page actions */}
      <button id="unrotate" onClick={handleUnrotate}>
        rotate back
      </button>
    </div>
  );
}

export default RotatableImage;