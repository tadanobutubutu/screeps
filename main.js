import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <main>
    <App />
  </main>
);

// Add a component to handle the rotation functionality
const RotationControl = () => {
  const handleRotateBack = () => {
    // Implement your rotation logic here
    console.log('Rotating back');
  };

  return (
    <button id="unrotate" onClick={handleRotateBack}>
      rotate back
    </button>
  );
};

// Export the RotationControl component if needed elsewhere
export { RotationControl };