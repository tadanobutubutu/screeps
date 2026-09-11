// TODO: replace this with your implementation for handling the new function

/**
 * Creates a button element for in-page interactions.
 * @param {string} text - The text content of the button.
 * @param {function} onClick - The click event handler for the button.
 * @returns {HTMLButtonElement} The created button element.
 */
function createButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}

// Existing code (to be preserved)
const someExistingVariable = 'example';
const anotherConstant = 42;

/**
 * Existing function that does something.
 * @returns {string} A message.
 */
function existingFunction() {
  return 'This is an existing function';
}

/**
 * Another existing function that processes data.
 * @param {Array} data - Input data array.
 * @returns {Array} Processed data.
 */
function processData(data) {
  return data.map(item => item * 2);
}

// Export the new createButton function along with existing exports
export { createButton, existingFunction, processData };