// main.js

// TODO: Implement this function for creating in-page buttons
function createInPageButton(buttonId, buttonText) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  document.body.appendChild(button);
}

function anotherFunction() {
  return 'another function';
}

// Module exports
module.exports = {
  existingFunction,
  anotherFunction
};