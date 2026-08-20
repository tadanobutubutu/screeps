import React from 'react';
import ReactDOM from 'react-dom';
import './docs/dependency-graph.html';

// Main application logic
function rotateContent(direction) {
  const content = document.querySelector('.rotatable-content');
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

  const rotateButton = document.getElementById('rotate');
  if (rotateButton) {
    rotateButton.addEventListener('click', () => {
      rotateContent('forward');
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', setupEventListeners);

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
  document.getElementById('root')
);

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    rotateContent,
    setupEventListeners
  };
}