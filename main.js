// main.js - Fixed REACT_036 accessibility issue
// Changed <a href="#"> to <button> for the "rotate back" action

import React, { useState } from 'react';

// Example component that renders the fixed code
const ImageRotator = () => {
  const [rotation, setRotation] = useState(0);

  const handleRotateBack = () => {
    setRotation((prev) => (prev === 0 ? 270 : prev - 90));
  };

  return (
    <div className="image-rotator">
      <img
        src="/image.jpg"
        alt="Rotatable content"
        style={{ transform: `rotate(${rotation}deg)` }}
      />
      
      {/* Fixed: Changed from <a id="unrotate" href="#">rotate back</a> to <button> */}
      <button id="unrotate" onClick={handleRotateBack} type="button">
        rotate back
      </button>
    </div>
  );
};

// Alternative: If you need to keep it as an anchor for styling reasons,
// you can add role="button" and proper keyboard handling, but a <button> is preferred:

const AccessibleLinkAsButton = ({ onClick, children }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      onKeyDown={handleKeyDown}
      role="button"
    >
      {children}
    </a>
  );
};

// Main export - adapt this to your actual main.js structure
export { ImageRotator, AccessibleLinkAsButton };