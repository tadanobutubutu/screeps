// Preserve all existing code from the original main.js
// ... (all your existing code remains unchanged)

// Add the new button functionality from the pull request
function handleRotateBack() {
  // Your rotation back logic here
  console.log('Rotating back');
}

// For when the code runs in a non-React environment, use the existing function insertRotationButton
function insertRotationButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.textContent = 'rotate back';
  button.addEventListener('click', handleRotateBack);

  // Insert the button where needed in your DOM
  // For example:
  // document.getElementById('some-container').appendChild(button);
}

// When the code runs in a React environment, render a React button component that triggers handleRotation
import React from 'react';

const handleRotation = (e) => {
  e.preventDefault();
  // Add your rotation logic here
  console.log('Rotation triggered');
};

const RotationButton = () => (
  <button
    id="unrotate"
    onClick={handleRotation}
    aria-label="Rotate back"
    style={{
      background: 'none',
      border: 'none',
      padding: 0,
      font: 'inherit',
      cursor: 'pointer',
      color: 'inherit',
      textDecoration: 'underline'
    }}
  >
    rotate back
  </button>
);

// Export handleRotation and RotationButton for React usage
export { handleRotation, RotationButton };