import React, { useState } from 'react';

const MyComponent = () => {
  const [isRotated, setIsRotated] = useState(false);

  const handleUnrotate = () => {
    setIsRotated(false);
  };

  return (
    <div className={`container ${isRotated ? 'rotated' : ''}`}>
      <h1>My Component</h1>
      <p>This is some content that can be rotated.</p>
      
      {isRotated && (
        <button id="unrotate" onClick={handleUnrotate}>
          rotate back
        </button>
      )}
    </div>
  );
};

export default MyComponent;