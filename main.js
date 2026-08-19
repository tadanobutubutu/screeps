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