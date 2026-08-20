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

// Main component for layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <svg
          aria-hidden="true"
          style={{ display: "none" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* decorative elements */}
        </svg>
        <main role="main" aria-label="Main content">
          {children}
        </main>
      </body>
    </html>
  );
}

// New function to handle dependency updates
export function getUpdatedDependencies() {
  return {
    jest: "^30.0.0",
    react: "^19.0.0",
    eslint: "^10.0.0",
    typescript: "^7.0.0",
    babelJest: "^30.0.0"
  };
}

// React rendering setup
ReactDOM.render(
  <React.StrictMode>
    {/* Other components */}
    <div id="unrotate-container">
      {/* Replace the anchor tag with a button */}
      <button id="unrotate" onClick={() => rotateContent('back')}>
        rotate back
      </button>
    </div>
    <div id="rotate-container">
      <button id="rotate" onClick={() => rotateContent('forward')}>
        rotate forward
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
    setupEventListeners,
    getUpdatedDependencies
  };
}