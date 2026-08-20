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
  const unrotateButton = ...
  if (unrotateButton) {
    ... () => {
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
    <div lang="en">
      {/* Other components */}
      <div id="unrotate" role="region" aria-label="Rotation controls">
        {/* Replace the anchor tag with a button */}
        <button id="unrotate" onClick={() => rotateContent('back')} aria-label="Rotate content back to original position">
          rotate back
        </button>
      </div>
      {/* Other components */}
    </div>
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