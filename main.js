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

/**
 * Adds scope="col" to all <th> elements in a table for accessibility
 * Fixes REACT_027: React Table Structure - th has no scope
 * @param {HTMLElement|string} table - Table element or selector
 * @param {string} [scope='col'] - Scope value ('col' or 'row')
 */
function addTableHeaderScope(table, scope = 'col') {
  const tableEl = typeof table === 'string' ? document.querySelector(table) : table;
  if (!tableEl) return;

  const headers = tableEl.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      th.setAttribute('scope', scope);
    }
  });
}

// Modify the event listeners to include `aria-label`
addAriaLabel(document.getElementById('rotate'), 'Rotate image clockwise');
addAriaLabel(document.getElementById('unrotate'), 'Rotate image anti-clockwise');

module.exports = {
  loop: function() { /* Main game loop logic myNewFunction(); */ },
  add,
  subtract,
  multiply,
  divide,
  addAriaLabel,
  addTableHeaderScope
};