// TODO: This is the existing code that needs to be preserved

// New function for creating in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;
  document.body.appendChild(button);
}

// Existing exports and functions
export function someExistingFunction() {
  // ... existing function code ...
}

export function anotherExistingFunction() {
  // ... existing function code ...
}