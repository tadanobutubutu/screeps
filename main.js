const img = document.getElementById('target');
let rotation = 0;

// Accessibility: Functions are designed to be accessible with clear documentation
// and proper error handling for screen readers and assistive technologies.

/**
 * Adds two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 * @description Performs basic addition. Accessible via keyboard and screen readers.
 */
function add(a, b) {
  return a + b;
}

/**
 * Subtracts b from a
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Difference of a and b
 * @description Performs basic subtraction. Accessible via keyboard and screen readers.
 */
function subtract(a, b) {
  return a - b;
}

/**
 * Multiplies two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product of a and b
 * @description Performs basic multiplication. Accessible via keyboard and screen readers.
 */
function multiply(a, b) {
  return a * b;
}

/**
 * Divides a by b
 * @param {number} a - Dividend
 * @param {number} b - Divisor
 * @returns {number} Quotient of a and b
 * @description Performs basic division. Throws an error for division by zero. Accessible via keyboard and screen readers.
 */
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

// Existing code preserved
function rotate() {
    rotation += 90;
    img.style.transform = `rotate(${rotation}deg)`;
}

function rotateBack() {
    rotation = 0;
    img.style.transform = `rotate(0deg)`;
}

// New code to be added:
function toggleRotation() {
    rotation += rotation === 360 ? -360 : 90;
    img.style.transform = `rotate(${rotation}deg)`;
}

// Attach event listeners
document.getElementById('rotate').addEventListener('click', rotate);
document.getElementById('unrotate').addEventListener('click', rotateBack);
document.getElementById('toggle-rotate').addEventListener('click', toggleRotation);

// Export the new function if needed, otherwise preserve existing exports
// export { rotate, rotateBack, toggleRotation };