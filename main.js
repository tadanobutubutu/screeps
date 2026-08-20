import React from 'react';
import ReactDOM from 'react-dom';
import ...

// Main application logic
function rotateContent(direction) {
  const content = ...
  if (content) {
    const rotation = direction === 'back' ? 0 : 90;
    content.style.transform = `rotate(${rotation}deg)`;
  }
}

// Setup event listeners
function setupEventListeners() {
  const unrotateButton = document.getElementById('unrotate');
  if (unrotateButton) {
    unrotateButton.addEventListener('click', () => {
      rotateContent('back');
    });
  }

  const rotateButton = ...
  if (rotateButton) {
    ... () => {
      rotateContent('forward');
    });
  }
}

// Initialize when DOM is ready
... setupEventListeners);

// React rendering setup
ReactDOM.render(
  <React.StrictMode>
    {/* Other components */}
    <div id="unrotate">
      {/* Replace the anchor tag with a button */}
      <button id="unrotate" onClick={() => rotateContent('back')}>
        rotate back
      </button>
    </div>
    {/* Other components */}
  </React.StrictMode>,
  ...
);

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    rotateContent,
    setupEventListeners
  };
}