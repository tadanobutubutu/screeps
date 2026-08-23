// Import React and ReactDOM for potential React usage in the dashboard
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import layout from './layout';
import dashboardLayout from './dashboard/layout';

// Function to wrap primary content with a <main> element
function wrapContentWithMain() {
  const contentToWrap = document.querySelector('div.container'); // Adjust selector if needed
  if (contentToWrap) {
    const mainElement = document.createElement('main');
    mainElement.appendChild(contentToWrap);
    document.body.insertBefore(mainElement, document.body.firstChild);
  }
}

// Call the wrapper to adjust the DOM structure
wrapContentWithMain();

document.addEventListener('DOMContentLoaded', () => {
  // Original link that triggers "rotate back"
  const unrotateLink = document.getElementById('unrotate');
  // New button that also triggers "rotate back"
  const unrotateButton = document.getElementById('unrotate-button');

  // Ensure the link is hidden but still functional
  if (unrotateLink) {
    unrotateLink.style.display = 'none';
  }

  // Function containing the existing "rotate back" logic
  const rotateBack = () => {
    // Placeholder for existing rotation logic
    console.log('Rotating back...');
    // ... (your original rotate‑back implementation here)
  };

  // Add click listeners to both the link and the button
  if (unrotateLink) {
    unrotateLink.addEventListener('click', rotateBack);
  }
  if (unrotateButton) {
    unrotateButton.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default anchor behavior if button is used inside an <a>
      rotateBack();
    });
  }

  // Clean up any old listeners that are no longer needed
  // (Assuming someExistingFunction was previously bound to the link)
  // const someExistingFunction = () => { /* ... */ };
  // unrotateLink.removeEventListener('click', someExistingFunction);
});

// -------------------------------------------------------------------
// Rest of the original main.js code continues here...
// Ensure any exports, functions, or additional logic are preserved.
// -------------------------------------------------------------------