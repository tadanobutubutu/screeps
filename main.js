// Main application logic

// Function to handle the unrotate action
function handleUnrotate() {
  // Logic to rotate back to original state
  console.log('Rotating back...');
  // ... rotation logic
}

// Function to render the unrotate button (accessibility fix applied)
function renderUnrotateButton() {
  return '<button id="unrotate" aria-label="Rotate back to original view">rotate back</button>';
}

// Function to create a main landmark wrapper for accessibility
function createMainLandmark(content) {
  return `<main role="main">${content}</main>`;
}

// Example: Initialize the unrotate functionality
function initUnrotateFeature(containerElement) {
  if (containerElement) {
    const buttonHtml = renderUnrotateButton();
    const wrappedContent = createMainLandmark(buttonHtml);
    containerElement.innerHTML = wrappedContent;
    const unrotateBtn = document.getElementById('unrotate');
    if (unrotateBtn) {
      unrotateBtn.addEventListener('click', handleUnrotate);
    }
  }
}

// Export for module usage
export { handleUnrotate, renderUnrotateButton, initUnrotateFeature, createMainLandmark };