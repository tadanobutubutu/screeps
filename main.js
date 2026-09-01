// TODO: This is the existing code that needs to be preserved

// This is a simple greeting module
function greet(name) {
  return `Hello, ${name}!`;
}
// TODO: Any additional changes requested in the issue should be added after this function

// New function implementation as per the issue requirements
function newFunction() {
  // Implementation details go here
  // For example:
  // return 'New function result';
}

// TODO: Implement a new function to handle focus trap for keyboard navigation
function handleFocusTrap(event) {
  // Only process Tab key events
  if (event.key !== 'Tab') {
    return;
  }

  // Get the element that should be the focus trap container
  // This could be a modal, dialog, or any container with focusable elements
  const focusTrapContainer = event.currentTarget;

  // Get all focusable elements within the container
  const focusableElements = focusTrapContainer.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), iframe, object, embed'
  );

  // Convert NodeList to Array for easier manipulation
  const focusableArray = Array.from(focusableElements);

  // If there are no focusable elements, do nothing
  if (focusableArray.length === 0) {
    return;
  }

  // Prevent default only if we need to redirect focus
  const firstElement = focusableArray[0];
  const lastElement = focusableArray[focusableArray.length - 1];

  // If Shift+Tab is pressed and focus is on the first element, move to the last element
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  }
  // If Tab is pressed (without Shift) and focus is on the last element, move to the first element
  else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

// Function to set up focus trap on an element
function setupFocusTrap(element) {
  if (!element) {
    return;
  }
  
  // Add event listener for keydown events to handle Tab navigation
  element.addEventListener('keydown', handleFocusTrap);
  
  // Return cleanup function
  return function cleanup() {
    element.removeEventListener('keydown', handleFocusTrap);
  };
}

// Existing exports must be preserved
export function existingFunction() {
  // Implementation details go here
}

export function anotherExistingFunction() {
  // Implementation details go here
}

// Exported functions
export function calculateSum(a, b) {
  return a + b;
}

export function calculateProduct(a, b) {
  return a * b;
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateSum, calculateProduct };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
}