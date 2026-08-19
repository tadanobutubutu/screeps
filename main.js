// main.js

// Preserve all existing code and exports
// Only adding the new function for the React Fake Link issue

// ... (all existing code from current main.js)

/**
 * Handles the rotation back action for the dependency graph
 * Replaces the fake link with a proper button element
 */
function handleRotateBack() {
  const rotateBackButton = document.getElementById('unrotate');
  if (rotateBackButton) {
    // Create a new button element
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = 'rotate back';
    button.className = rotateBackButton.className;

    // Copy any event listeners from the original element
    const clone = rotateBackButton.cloneNode(true);
    clone.id = 'unrotate-clone';
    rotateBackButton.parentNode.insertBefore(clone, rotateBackButton);
    rotateBackButton.parentNode.replaceChild(button, rotateBackButton);

    // Copy event listeners
    const oldElement = document.getElementById('unrotate-clone');
    const newElement = document.getElementById('unrotate');

    const oldElementEvents = getEventListeners(oldElement);
    if (oldElementEvents && oldElementEvents.click) {
      oldElementEvents.click.forEach(listener => {
        newElement.addEventListener('click', listener.listener);
      });
    }

    // Remove the clone
    oldElement.remove();
  }
}

// Initialize the rotation back button when the DOM is loaded
document.addEventListener('DOMContentLoaded', handleRotateBack);

// ... (rest of existing code from current main.js)