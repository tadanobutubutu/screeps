// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

// Function to create in-page buttons with ARIA attributes for accessibility
function createInPageButton(buttonText, onClickHandler, buttonId = null) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  button.addEventListener('click', onClickHandler);

  // Add ARIA attributes for accessibility
  if (buttonId !== null) {
    button.id = buttonId;
    button.setAttribute('aria-label', `Button with ID: ${buttonId}`);
  } else {
    // Generate a unique ID for the button if no ID is provided
    button.id = `button-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  return button;
}

// Existing exports preserved

// Main entry point for the application

export { createInPageButton };

// ... (Rest of the code in the existing main.js)