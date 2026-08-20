// TODO: Address accessibility issues from insight report:

// Handler function for the unrotate button with accessibility support
function handleUnrotateClick(event) {
  // Prevent default only if it's a link element without proper action
  if (event.target.tagName === 'A' && event.target.getAttribute('href') === '#') {
    event.preventDefault();
  }
  
  // Call the rotation reset function
  resetRotation();
  
  // Set focus to the unrotate element after action for accessibility
  const unrotateElement = document.getElementById('unrotate');
  if (unrotateElement) {
    unrotateElement.focus();
  }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', function() {
  const unrotateElement = document.getElementById('unrotate');
  if (unrotateElement) {
    // Add click event listener
    unrotateElement.addEventListener('click', handleUnrotateClick);
    
    // Ensure proper keyboard support (Enter and Space for buttons)
    if (unrotateElement.tagName !== 'BUTTON') {
      unrotateElement.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleUnrotateClick(event);
        }
      });
    }
    
    // Add aria-label if needed for better screen reader support
    if (!unrotateElement.getAttribute('aria-label') && !unrotateElement.textContent.trim()) {
      unrotateElement.setAttribute('aria-label', 'Rotate back to original position');
    }
  }
});

// Rotation reset function
function resetRotation() {
  const rotatedElement = document.getElementById('rotated');
  if (rotatedElement) {
    rotatedElement.style.transform = 'rotate(0deg)';
  }
}

// Export for testing
module.exports = {
  handleUnrotateClick,
  resetRotation
};