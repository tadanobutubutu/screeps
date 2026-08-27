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
    'tabIndex': 0, // Add tabindex attribute for focusability
  });
  errorSection.appendChild(errorElement);

  if (container) {
    const errorContainer = getDocument().createElement(container);
    errorContainer.appendChild(errorSection);
    container.appendChild(errorContainer);
  } else {
    getDocument().body.appendChild(errorSection);
  }

  // If trigger is true, trigger the accessibility mode
  if (trigger) {
    triggerAccessibilityMode();
  }
}

// Implement the handleAccessibilityError function that wraps handleErrorState with triggering the accessibility mode
function handleAccessibilityError(errorElement, container) {
  handleErrorState(errorElement, container, true);
}

// Get the button with the specified ID
function getButtonWithId() {
  return getDocument().querySelector('#buttonWithId');
}

// Add a new function to toggle focus on the specified button
function setButtonFocus(button, focus = true) {
  if (button && focus) {
    button.focus();
  }
}

// Add a new function to check if an element is focusable
function isFocusable(element) {
  return (
    element.type === 'button' ||
    element.type === ' checkbox' ||
    element.type === ' radio' ||
    element.hasAttribute &&
    element.hasAttribute('tabindex')
  );
}

// Exit the existing handleErrorState function
export { handleErrorState };

// Export the new handleAccessibilityError function
export { handleAccessibilityError };

// Export the new getButtonWithId function to get the button with the specified ID
export { getButtonWithId };

// Export the new setButtonFocus function to set focus on the specified button
export { setButtonFocus };

// Export the new isFocusable function to check if an element is focusable
export { isFocusable };