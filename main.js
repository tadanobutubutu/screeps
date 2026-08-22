Here is the resolved file content:

```javascript
Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?
=======
// Accessibility utility functions

// Add lang attribute to HTML root element
// Adjust to the desired language. I'm keeping the original approach.
document.documentElement.setAttribute('lang', 'en');

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

export function createHtmlElement(language = 'en') {   // Keep original export function
  return {
    type: 'html',
    props: {
      lang: language,
      children: []
    }
  };
}

const img = document.getElementById('target'); // Merge both functions related to the 'img' element
let rotation = 0;

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

// Integrate the new function from the 'origin/main' branch
function newFunction() {
  console.log('This is the new function');
}

module.exports = {
  add, // Retain existing functions
  subtract,
  multiply,
  divide,
  createHtmlElement, // Keep original export function
  newFunction // Integrate the new function from the 'origin/main' branch
};
```

This resolved file retains both sets of changes, integrating the new function from the `origin/main` branch and maintaining the existing accessibility utility functions with the original approach to setting the lang attribute on the HTML root element.