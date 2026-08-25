// Assuming the content was originally something like this:
// Safety: true;

// Fixing the Safety issue by renaming it if it was a typo
const isSafetyEnabled = true;

// Removing any HTML content that should not be in a JavaScript file
// <html lang="en">
// <head>
//   <title>Document</title>
// </head>
// <body>
//   <div lang="en">This is an English text</div>
// </body>
// </html>

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

// Add functions for adding `aria-label` to buttons
function addAriaLabel(elem, label) {
  if (elem) {
    elem.setAttribute('aria-label', label);
  }
}

// Add `aria-label` to the rotation and unrotate buttons
addAriaLabel(document.getElementById('rotate'), 'Rotate image clockwise');
addAriaLabel(document.getElementById('unrotate'), 'Rotate image anti-clockwise');

/**
 * A new function for adding `aria-label` to arbitrary elements
 * @param {HTMLElement} elem - The HTML element to add `aria-label` to
 * @param {string} label - The text to use as the `aria-label`
 */
function setAriaLabelOn(elem, label) {
  if (elem) {
    elem.setAttribute('aria-label', label);
  }
}

// An example usage of the new function with a custom button element
const customBtn = document.getElementById('custom-btn');
setAriaLabelOn(customBtn, 'Perform custom action');

module.exports = {
  loop: function() { /* Main game loop logic myNewFunction(); */ },
  add,
  subtract,
  multiply,
  divide,
  addAriaLabel,
  setAriaLabelOn
};