import React, { useState } from 'react';

function ImageViewer({ image }) {
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const handleRotate = (degrees) => {
    setIsRotating(true);
    setRotation((prev) => prev + degrees);
    setTimeout(() => setIsRotating(false), 300);
  };

  const handleRotateBack = () => {
    setRotation(0);
  };

  return (
    <div className="image-viewer">
      <div className="image-container">
        <img
          src={image.src}
          alt={image.alt}
          style={{ transform: `rotate(${rotation}deg)` }}
          className={isRotating ? 'rotating' : ''}
        />
      </div>

      <div className="controls">
        <button
          onClick={() => handleRotate(90)}
          aria-label="Rotate image 90 degrees clockwise"
        >
          Rotate 90°
        </button>
        <button
          onClick={() => handleRotate(-90)}
          aria-label="Rotate image 90 degrees counter-clockwise"
        >
          Rotate -90°
        </button>
        {rotation !== 0 && (
          <button id="unrotate" onClick={handleRotateBack}>
            rotate back
          </button>
        )}
      </div>
    </div>
  );
}

export default ImageViewer;