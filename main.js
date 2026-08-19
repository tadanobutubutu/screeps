// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code (preserved)
const App = () => {
  return (
    <div>
      {/* Other existing components */}
    </div>
  );
};

// Add accessible name to SVG in app/layout.tsx
const FaviconSVG = () => (
  <svg
    aria-hidden="true"
    width="0"
    height="0"
    style={{ position: 'absolute' }}
  >
    <title>Favicon</title>
    {/* SVG content */}
  </svg>
);

// Add accessible name to SVG in dashboard/app/layout.tsx
const DashboardFaviconSVG = () => (
  <svg
    aria-hidden="true"
    width="0"
    height="0"
    style={{ position: 'absolute' }}
  >
    <title>Dashboard Favicon</title>
    {/* SVG content */}
  </svg>
);

// Existing exports (preserved)
export default App;
export { someExistingFunction, anotherExistingFunction }; // Replace with actual existing functions

// main.js - Updated to fix REACT_036 accessibility warning
if (typeof document !== 'undefined') {
  // Initialize rotation state
  let isRotated = false;

  // Handle rotate button click
  const handleRotate = () => {
    const content = document.getElementById('content');
    if (content) {
      if (isRotated) {
        content.style.transform = 'rotate(0deg)';
        isRotated = false;
      } else {
        content.style.transform = 'rotate(90deg)';
        isRotated = true;
      }
    }
  };

  // Handle unrotate button click (using button element for accessibility)
  const handleUnrotate = () => {
    const content = document.getElementById('content');
    if (content) {
      content.style.transform = 'rotate(0deg)';
      isRotated = false;
    }
  };

  // Set up event listeners when DOM is ready
  const setupRotation = () => {
    const rotateBtn = document.getElementById('rotate');
    const unrotateBtn = document.getElementById('unrotate');
    if (rotateBtn) {
      rotateBtn.addEventListener('click', handleRotate);
    }
    if (unrotateBtn) {
      unrotateBtn.addEventListener('click', handleUnrotate);
    }

    // Only set sample content if the element exists and is empty
    const content = document.getElementById('content');
    if (content && !content.innerHTML.trim()) {
      content.innerHTML = `
        <h1>Welcome to the App</h1>
        <p>Click the rotate button to rotate the content.</p>
        <button id="rotate">Rotate</button>
        <button id="unrotate">rotate back</button>
      `;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupRotation);
  } else {
    setupRotation();
  }
}