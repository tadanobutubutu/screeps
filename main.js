// Accessibility utility functions

// Add lang attribute to HTML root element
document.documentElement.setAttribute('lang', 'en'); // Adjust to the desired language


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

export function createHtmlElement(language = 'en') {  
  return {  
    type: 'html',  
    props: {  
      lang: language,  
      children: []  
    }  
  };  
}

const img = document.getElementById('target'); let rotation = 0;

function rotate() {
  rotation += 90;
  img.style.transform = `rotate(${rotation}deg)`;
}

function rotateBack() {
  rotation = 0;
  img.style.transform = `rotate(0deg)`;
}

// Attach event listeners
document.getElementById('rotate').addEventListener('click', rotate);
document.getElementById('unrotate').addEventListener('click', rotateBack);

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  announceToScreenReader,
  trapFocus,
  releaseFocus,
  setFocusToFirstFocusable,
  updateFaviconSVG,
  // New function added as per the issue
  newFunction
};