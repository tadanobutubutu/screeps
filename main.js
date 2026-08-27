// main.js
// Entry point for the application

/**
 * Wraps the primary content in a main container.
 * 
 * @param {HTMLElement} target - The element containing primary content
 * @returns {HTMLElement} The newly created <main> element
 */
function wrapPrimaryContentInMain(target) {
  const mainElement = document.createElement('main');
  target.appendChild(mainElement);
  return mainElement;
}

// Existing code and exports remain unchanged