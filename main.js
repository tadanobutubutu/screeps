// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// New function to handle focus trap for keyboard navigation
function focusTrap(element) {
  let lastFocusedElement = null;

  // Set focus inside the element, or the first focusable element inside it
  function trapFocus() {
    const focusableElements = element.querySelectorAll('a, button, input, select, textarea');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (document.activeElement === element) {
      // If the current focused element is the element itself, move focus to the first focusable element
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
    } else if (!document.activeElement.contains(element)) {
      // If the active element is outside the element, move focus back to the element itself
      element.focus();
    } else {
      // If the active element is inside the element, move focus to the last focusable element
      lastFocusedElement = document.activeElement;
      if (lastFocusableElement) {
        lastFocusableElement.focus();
      }
    }
  }

  // Add event listeners for focus and blur events
  element.addEventListener('focus', trapFocus);
  element.addEventListener('blur', function() {
    lastFocusedElement = document.activeElement;
  });

  // Return a function to remove the focus trap
  return function removeFocusTrap() {
    element.removeEventListener('focus', trapFocus);
    element.removeEventListener('blur', removeFocusTrap);
  };
}

// Example usage: Apply the focus trap to the main content area of your application
const mainContent = document.querySelector('#main-content');
const removeTrap = focusTrap(mainContent);

// When the application is about to close or the focus trap is no longer needed, remove the trap
// removeTrap();