/**
 * Creates an in-page button element with optional click handler.
 * @param {string} buttonText - The label text for the button
 * @param {Function} onClickHandler - Callback function triggered when the button is clicked
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  if (onClickHandler && typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

// Export the function so it can be imported by other modules
export { createInPageButton };

// ADD: Address new accessibility issues from insight report

// REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svgElement) {
  // Implement a logic to generate an accessible name for the given SVG element
  // For the sake of example, let's use the SVG's title attribute as the accessible name
  return svgElement.title || '';
}

// Use the function to provide accessible names for the SVGs
// Example usage:
const svg1 = document.getElementById('svg1');
if (svg1) {
  svg1.setAttribute('aria-labelledby', 'svg1-name');
  const svgName1 = document.createElement('span');
  svgName1.id = 'svg1-name';
  svgName1.innerText = getSvgAccessibleName(svg1);
  svg1.appendChild(svgName1);
}

/**
 * Existing module functionality
 */
function existingFunction() {
  return "This is existing functionality";
}

module.exports = {
  initialize,
  setupSkipLinks,
  setupButtonAccessibility,
  createInPageButton,
  performTask,
  handleEvent,
  greet,
  add
};

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}