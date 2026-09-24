// This is a simple greeting module
function greet (name) {
  return `Hello, ${name}!`
}

// Add lang attribute to HTML element to address accessibility issue
function setLangAttribute(lang) {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
}

// Exported functions
export function calculateSum (a, b) {
  return a + b
}
export function calculateProduct (a, b) {
  return a * b
}

// Address accessibility issues from insight report
export function getAccessibleGreeting (name) {
  // Assuming accessibility issue is related to providing a non-empty name
  if (!name) {
    throw new Error('Name must be provided to create an accessible greeting.')
  }
  return `Hello, ${name}!`
}

export function calculateProduct(a, b) {
  return a * b;
}

// Add export for the new function
export { setLangAttribute };