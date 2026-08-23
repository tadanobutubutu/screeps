// main.js

// Sample application state
const state = {
  isRotated: false
};

// Toggle rotation state
function toggleRotation() {
  state.isRotated = !state.isRotated;
  const container = document.getElementById('container');
  if (container) {
    container.style.transform = state.isRotated ? 'rotate(180deg)' : 'rotate(0deg)';
  }
  updateToggleLink();
}

// Update the toggle link text based on state
function updateToggleLink() {
  const link = document.getElementById('unrotate');
  if (link) {
    link.textContent = state.isRotated ? 'rotate back' : 'rotate';
  }
}

// Event handlers
function handleRotateClick(e) {
  e.preventDefault();
  toggleRotation();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  const rotateLink = document.getElementById('unrotate');
  if (rotateLink) {
    // Replace anchor with button for accessibility
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.type = 'button';
    button.textContent = rotateLink.textContent;
    button.addEventListener('click', handleRotateClick);
    
    rotateLink.parentNode.replaceChild(button, rotateLink);
  }
});