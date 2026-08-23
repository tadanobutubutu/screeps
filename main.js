// Main application logic
const init = () => {
  // Initialize application
  console.log("Application initialized");
};

// Rotate functionality
const rotateImage = (element) => {
  // Rotate logic here
};

const unrotateImage = (element) => {
  // Unrotate logic here
};

// Render the rotate back link as a button for accessibility
const renderControls = () => {
  const container = document.getElementById('controls');
  if (container) {
    // Use a button instead of an anchor with href="#" for proper accessibility
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = 'rotate back';
    button.addEventListener('click', () => {
      unrotateImage(document.getElementById('image'));
    });
    container.appendChild(button);
  }
};

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    init,
    rotateImage,
    unrotateImage,
    renderControls
  };
}