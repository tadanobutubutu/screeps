import React from 'react';

function RotateableImage() {
  const handleUnrotate = () => {
    const element = document.getElementById('rotateable');
    if (element) {
      element.classList.remove('rotated');
    }
  };

  return (
    <div className="rotate-container">
      <div id="rotateable" className="rotated">
        <img src="/image.jpg" alt="Rotatable content" />
      </div>
      <button id="unrotate" onClick={handleUnrotate}>
        rotate back
      </button>
    </div>
  );
}

export default RotateableImage;