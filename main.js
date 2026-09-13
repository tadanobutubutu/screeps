// TODO: Implement this function for creating in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass, ariaLabel) {
  // Create a new button element
  const button = document.createElement('button');

  // Set the button's ID, text content, class, and ARIA label (required for accessibility)
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;
  button.setAttribute('aria-label', ariaLabel || 'BUTTON_ARIA_LABEL'); // Set an default aria-label if provided

  // Append the button to the body or a specific container
  document.body.appendChild(button);

  // Return the created button for further manipulation if needed
  return button;
}

// ... rest of your main.js code ...

// Export the new function if it's needed to be used in other files
export { createInPageButton };