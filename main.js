// Main application logic

// Function to handle the unrotate action
function handleUnrotate() {
  // Logic to rotate back to original state
  console.log('Rotating back...');
  // ... rotation logic
}

// Function to render the unrotate button (accessibility fix applied)
function renderUnrotateButton() {
  return '<button id="unrotate" aria-label="Rotate back to original position">rotate back</button>';
}

// Function to create an accessible SVG element
function createAccessibleSVG(svgContent, ariaLabel = '', isDecorative = false) {
  if (isDecorative) {
    return `<svg aria-hidden="true">${svgContent}</svg>`;
  }
  return `<svg aria-label="${ariaLabel}">${svgContent}</svg>`;
}

// Example: Initialize the unrotate functionality
function initUnrotateFeature(containerElement) {
  if (containerElement) {
    containerElement.innerHTML = renderUnrotateButton();
    const unrotateBtn = document.getElementById('unrotate');
    if (unrotateBtn) {
      unrotateBtn.addEventListener('click', handleUnrotate);
    }
  }
}

// Export for module usage
export { handleUnrotate, renderUnrotateButton, initUnrotateFeature, createAccessibleSVG };