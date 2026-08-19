// Main application logic

// Function to handle the unrotate action
function handleUnrotate() {
  // Logic to rotate back to original state
  console.log('Rotating back...');
  // ... rotation logic
}

// Function to render the unrotate button (accessibility fix applied)
function renderUnrotateButton() {
  return '<button id="unrotate">rotate back</button>';
}

// New function to handle keyboard events for accessibility
function handleUnrotateKeyPress(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleUnrotate();
  }
}

// Example: Initialize the unrotate functionality
function initUnrotateFeature(containerElement) {
  if (containerElement) {
    containerElement.innerHTML = renderUnrotateButton();
    const unrotateBtn = document.getElementById('unrotate');
    if (unrotateBtn) {
      unrotateBtn.addEventListener('click', handleUnrotate);
      // Add keyboard accessibility
      unrotateBtn.addEventListener('keydown', handleUnrotateKeyPress);
      // Set ARIA attributes for better accessibility
      unrotateBtn.setAttribute('role', 'button');
      unrotateBtn.setAttribute('tabindex', '0');
    }
  }
}

// Export for module usage
export { handleUnrotate, renderUnrotateButton, initUnrotateFeature };