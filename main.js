import React from 'react';

function App() {
  const handleRotateBack = () => {
    // Handle rotation reset logic
    document.body.style.transform = 'rotate(0deg)';
  };

  return (
    <div className="app">
      <h1>Image Rotator</h1>
      
      <div className="image-container">
        <img src="/sample-image.jpg" alt="Rotatable sample" />
      </div>
      
      {/* Fixed: Changed from <a href="#"> to <button> for proper accessibility */}
      <button id="unrotate" type="button" onClick={handleRotateBack}>
        rotate back
      </button>
    </div>
  );
}

export default App;