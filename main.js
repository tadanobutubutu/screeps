// Main application logic

// Rotate content function
function rotateContent(direction) {
  const content = document.querySelector('.rotatable-content');
  if (content) {
    const rotation = direction === 'back' ? 0 : 90;
    content.style.transform = `rotate(${rotation}deg)`;
  }
}

// Setup event listeners
function setupEventListeners() {
  // Rotate button - using <button> element instead of <a href="#">
  const unrotateButton = document.getElementById('unrotate');
  if (unrotateButton) {
    unrotateButton.addEventListener('click', () => {
      rotateContent('back');
    });
  }
  
  // Rotate forward button
  const rotateButton = document.getElementById('rotate');
  if (rotateButton) {
    rotateButton.addEventListener('click', () => {
      rotateContent('forward');
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', setupEventListeners);

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { rotateContent, setupEventListeners };
}