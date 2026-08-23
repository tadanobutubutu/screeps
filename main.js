import React from 'react';

function ImageRotator() {
  const [isRotated, setIsRotated] = React.useState(false);

  const handleRotate = () => {
    setIsRotated(!isRotated);
  };

  const handleUnrotate = () => {
    setIsRotated(false);
  };

  return (
    <div className="image-rotator">
      <h1>Image Rotator</h1>
      
      <div className={isRotated ? 'rotated' : ''}>
        <img src="/image.png" alt="Rotatable content" />
      </div>
      
      <button onClick={handleRotate}>
        {isRotated ? 'Currently Rotated' : 'Rotate'}
      </button>
      
      {isRotated && (
        <button id="unrotate" onClick={handleUnrotate}>
          rotate back
        </button>
      )}
    </div>
  );
}

export default ImageRotator;