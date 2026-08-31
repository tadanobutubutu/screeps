// ... (excluding the conflict markers) existing code from main.js

// TODO: Implement this function for creating in-page buttons
function createInPageButton(buttonId, buttonText) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  document.body.appendChild(button);
}

// ... (excluding the conflict markers) existing code from main.js