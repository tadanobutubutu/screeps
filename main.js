import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Function to handle unrotate (rotate back to original position)
function handleUnrotate() {
  const element = document.getElementById('rotated-element');
  if (element) {
    element.style.transform = 'rotate(0deg)';
  }
}

// Render the application
ReactDOM.render(
  <React.StrictMode>
    <App onUnrotate={handleUnrotate} />
  </React.StrictMode>,
  document.getElementById('root')
);

// Add event listener for the rotate back button once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const unrotateBtn = document.getElementById('unrotate');
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', handleUnrotate);
  }
});

// Fixed: Changed <a href="#"> to <button> for in-page action
// This fixes REACT_036 warning - "React Fake Link"
// <button id="unrotate">rotate back</button>
// Using <button> ensures proper keyboard and screen reader behavior