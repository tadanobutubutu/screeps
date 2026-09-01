// This is a simple greeting module
function greet(name) {
  return `Hello, ${name}!`;
}

// Add lang attribute to HTML element to address accessibility issue
function setLangAttribute(lang) {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
}

// Exported functions
export function calculateSum(a, b) {
  return a + b;
}

export function calculateProduct(a, b) {
  return a * b;
}

// Add export for the new function
export { setLangAttribute };