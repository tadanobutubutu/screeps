// This is a simple greeting module
function greet (name) {
  return `Hello, ${name}!`
}

// Adding a function to set the lang attribute on the HTML element
function setLangAttribute(htmlElement) {
  htmlElement.setAttribute('lang', 'en');
}

// Using the function to set the lang attribute on the HTML element
(function () {
  const html = document.documentElement;
  setLangAttribute(html);
})();

// Your code here for addressing other accessibility issues mentioned in the issue

export function calculateProduct(a, b) {
  return a * b;
}

// New export as per the issue requirements
export function newExportedFunction() {
  // Implementation details go here
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateSum, calculateProduct, newExportedFunction };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
  window.newExportedFunction = newExportedFunction;
}