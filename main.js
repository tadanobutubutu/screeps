const img = document.getElementById('target'); let rotation = 0;

function rotate() {
  rotation += 90;
  img.style.transform = `rotate(${rotation}deg)`;
}

function rotateBack() {
  rotation = 0;
  img.style.transform = `rotate(0deg)`;
}

/**
 * Adds two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
function add(a, b) {
  return a + b;
}

/**
 * Subtracts b from a
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Difference of a and b
 */
function subtract(a, b) {
  return a - b;
}

/**
 * Multiplies two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product of a and b
 */
function multiply(a, b) {
  return a * b;
}

/**
 * Divides a by b
 * @param {number} a - Dividend
 * @param {number} b - Divisor
 * @returns {number} Quotient of a and b
 */
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

// Add a new function for adding `aria-label` to buttons
function addAriaLabel(elem, label) {
  if (elem) {
    elem.setAttribute('aria-label', label);
  }
}

// Modify the event listeners to include `aria-label`
addAriaLabel(document.getElementById('rotate'), 'Rotate image clockwise');
addAriaLabel(document.getElementById('unrotate'), 'Rotate image anti-clockwise');

// Add back export for the main game loop logic (original change) and the new function
myNewFunction = function() { /* Custom game loop logic */ }; // Move myNewFunction to original position below exports

module.exports = {
  loop: function() {
    myNewFunction(); // Call the custom game loop logic within the loop
    // ...
  },
  myNewFunction, // Include the new function in the exports
  add,
  subtract,
  multiply,
  divide,
  addAriaLabel, // Include the new function in the exports
  // Add the updated th element with scope attribute here
  updateTableHeaders: function() {
    const tableHeaders = document.querySelectorAll('th');
    tableHeaders.forEach(header => {
      header.setAttribute('scope', 'col');
    });
  }
};