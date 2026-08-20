import React from 'react';
import { createRoot } from 'react-dom/client';

// This file should contain JavaScript code, not HTML
// The HTML content appears to be in a different file ...
// Please ensure all JavaScript code is properly formatted and valid

function RotateButton({ onClick, children }) {
  return (
    <button 
      id="unrotate" 
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function Main() {
  const handleRotateBack = () => {
    // Handle rotate back action
    // This could reset rotation, scroll to top, or other relevant action
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="App">
      <RotateButton onClick={handleRotateBack}>
        rotate back
      </RotateButton>
    </div>
  );
}

export default Main;