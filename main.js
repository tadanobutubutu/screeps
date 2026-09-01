// This is a simple greeting module
function greet(name) {
  return `Hello, ${name}!`;
}

// Exported functions
export function calculateSum(a, b) {
  return a + b;
}
export function calculateProduct(a, b) {
  return a * b;
}

// Additional functions to address accessibility issues
function ensureARIArole(container, role) {
  if (!container.getAttribute('role')) {
    container.setAttribute('role', role);
  }
}

function generateUniqueId() {
  let uniqueId = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 8;
  for (let i = 0; i < length; i++) {
    uniqueId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return uniqueId;
}

function applyAccessibilityFixes() {
  // Example container to apply accessibility fixes to
  const dependencyGraphContainer = document.getElementById('dependencyGraph');

  // Ensure the dependencyGraph container has a proper ARIA role
  ensureARIArole(dependencyGraphContainer, 'application');

  // Ensure all landmark elements have unique ids
  const landmarkElements = document.querySelectorAll('main, nav, section, article, aside, footer');
  landmarkElements.forEach((element) => {
    if (!element.id) {
      element.id = generateUniqueId();
    }
  });
}

// Call the function to apply accessibility fixes when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', applyAccessibilityFixes);