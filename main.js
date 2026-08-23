import React, { useState } from 'react';

export default function ImageRotator() {
  const [rotation, setRotation] = useState(0);

  const handleRotate = () => {
    setRotation((prev) => prev + 90);
  };

  const handleRotateBack = () => {
    setRotation(0);
  };

  return (
    <div className="image-rotator">
      <img
        src="/path/to/image.jpg"
        alt="Rotating image"
        style={{ transform: `rotate(${rotation}deg)` }}
      />
      <button onClick={handleRotate}>Rotate</button>
      <button id="unrotate" onClick={handleRotateBack}>rotate back</button>
    </div>
  );
}