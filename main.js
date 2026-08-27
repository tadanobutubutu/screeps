// TODO: Address accessibility issues from insight report

// Add the missing lang attribute to the <html> element
const htmlElement = getDocument().documentElement;
htmlElement.lang = 'en'; // Change the value to the desired language code

// Implement the handleErrorState function to handle the new accessibility issue
function handleErrorState(errorElement, container, trigger = false) {
  if (!errorElement) return;

  // Wrap the error in a <section> and container element (if provided)
  const errorSection = createElement('section', {
    'aria-live': 'polite', // Add ARIA live region
  });
  errorSection.appendChild(errorElement);

  if (container) {
    const errorContainer = getDocument().createElement('div');
    errorContainer.className = container;
    errorContainer.appendChild(errorSection);
    htmlElement.appendChild(errorContainer);
  } else {
    htmlElement.appendChild(errorSection);
  }

  // If trigger is true, trigger the accessibility mode
  if (trigger) {
    htmlElement.classList.add('accessibility-mode');
  }
}

// Implement the handleAccessibilityError function that wraps handleErrorState with triggering the accessibility mode
function handleAccessibilityError(errorElement, container) {
  handleErrorState(errorElement, container, true);
}

// Get the button with the specified ID
function getButtonWithId(buttonId) {
  return getDocument().getElementById(buttonId);
}

// Helper function to get the document object (allows for testing with JSDOM)
function getDocument() {
  return global.document;
}

// Helper function to create an element with attributes
function createElement(tagName, attributes = {}) {
  const element = getDocument().createElement(tagName);
  Object.keys(attributes).forEach(key => {
    element.setAttribute(key, attributes[key]);
  });
  return element;
}

// Exit the existing handleErrorState function
export { handleErrorState };

// Export the new handleAccessibilityError function
export { handleAccessibilityError };

// Export the new getButtonWithId function to get the button with the specified ID
export { getButtonWithId };