// Main application logic

// Function to handle the unrotate action
function handleUnrotate() {
  // Logic to rotate back to original state
  console.log('Rotating back...');
  // ... rotation logic
}

// Function to render the unrotate button (accessibility fix applied)
function renderUnrotateButton() {
  return `<button id="unrotate" type="button">rotate back</button>`;
}

// Function to initialize the unrotate feature
function initUnrotateFeature(containerElement) {
  if (containerElement) {
    containerElement.innerHTML = renderUnrotateButton();
    const unrotateBtn = document.getElementById('unrotate');
    if (unrotateBtn) {
      unrotateBtn.addEventListener('click', handleUnrotate);
    }
  }
}

// Keep backward compatibility with rotateBack name
function rotateBack() {
  handleUnrotate();
}

// Initialize the feature on page load (or wherever appropriate)
initUnrotateFeature(document.body);

// Export for module usage
export { handleUnrotate, renderUnrotateButton, initUnrotateFeature, rotateBack };