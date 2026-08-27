// Main application JavaScript file

// Rotate functionality
function setupRotateBack() {
  const unrotateLink = document.getElementById('unrotate');
  if (unrotateLink) {
    unrotateLink.addEventListener('click', function(e) {
      e.preventDefault();
      // Reset rotation
      document.querySelector('.rotated-content').style.transform = 'rotate(0deg)';
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  setupRotateBack();
});

// Export for testing
module.exports = {
  setupRotateBack
};