// TODO: Implement this function for creating in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
  // Create a new button element
  const button = document.createElement('button');

  // Set the button's ID, text content, and class
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;

  // Append the button to the body or a specific container
  document.body.appendChild(button);

  // Return the created button for further manipulation if needed
  return button;
}

// TODO: Implement this new function for making API calls
async function makeAPICall() {
  // Your implementation goes here
}

// Export the new functions if they are needed to be used in other files
export { createInPageButton, makeAPICall };