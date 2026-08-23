// main.js - Fixed version replacing fake link with button
import React from 'react';

function ImageViewer({ image, onRotate, onUnrotate }) {
  return (
    <div className="image-viewer">
      <img src={image.src} alt={image.alt} style={{ transform: `rotate(${image.rotation}deg)` }} />
      
      <button 
        id="rotate" 
        onClick={onRotate}
        aria-label="Rotate image"
      >
        rotate
      </button>
      
      <button 
        id="unrotate" 
        onClick={onUnrotate}
        aria-label="Rotate back to original position"
      >
        rotate back
      </button>
    </div>
  );
}

export default ImageViewer;