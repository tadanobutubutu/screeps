// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// New function to handle focus trap for keyboard navigation
function focusTrap(element) {
  let focusedElement = element;

  // Set focus on the element when the trap is activated
  function activateTrap() {
    focusedElement.focus();
  }

  // Function to trap focus within the element
  function trapFocus(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (focusedElement === element.firstChild) {
          e.preventDefault();
          element.lastChild.focus();
        }
      } else {
        if (focusedElement === element.lastChild) {
          e.preventDefault();
          element.firstChild.focus();
        }
      }
    }
  }

  // Function to deactivate the focus trap
  function deactivateTrap() {
    focusedElement = null;
  }

  // Attach event listeners to the element
  element.addEventListener('keydown', trapFocus);
  element.addEventListener('focusin', activateTrap);
  element.addEventListener('focusout', deactivateTrap);

  // Return a function to clean up the event listeners
  return function cleanUp() {
    element.removeEventListener('keydown', trapFocus);
    element.removeEventListener('focusin', activateTrap);
    element.removeEventListener('focusout', deactivateTrap);
  };
}

// Example usage (to be adjusted according to the actual usage in main.js)
// const cleanup = focusTrap(document.getElementById('container'));
// window.addEventListener('beforeunload', cleanup);