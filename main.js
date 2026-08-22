// main.js
// This file handles React rendering and requires lang attribute on HTML element
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Function to handle rotation actions
const handleRotation = (direction = 'back') => {
  const event = new CustomEvent('rotationChange', {
    detail: { direction }
  });
  window.dispatchEvent(event);
};

// Function to reset/initialize rotation
const initializeRotation = () => {
  const event = new CustomEvent('rotationReset');
  window.dispatchEvent(event);
};

// Export functions for use in components if needed
window.handleRotation = handleRotation;
window.initializeRotation = initializeRotation;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export { handleRotation, initializeRotation };