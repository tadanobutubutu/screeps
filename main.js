// main.js

// ... existing code above ...

// TODO: Implement this function for setting accessible names to SVGs
function setAccessibleName(svgElement, name) {
  if (!svgElement || !(svgElement instanceof Element) || svgElement.tagName.toLowerCase() !== 'svg') {
    return false;
  }

  if (!name) {
    return false;
  }

  // Check if a title element already exists
  let titleElement = svgElement.querySelector('title');
  const titleId = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  if (!titleElement) {
    // Create a new title element and insert it as the first child
    titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    titleElement.id = titleId;
    titleElement.textContent = name;
    svgElement.insertBefore(titleElement, svgElement.firstChild);
  } else {
    // Use existing title element
    titleElement.textContent = name;
  }

  // Set aria-labelledby to reference the title
  svgElement.setAttribute('aria-labelledby', titleElement.id);
  
  // Remove aria-label if it exists to prioritize the title relationship
  svgElement.removeAttribute('aria-label');
  
  return true;
}

// ... rest of existing code ...

// Export utility functions that are required by the test suite
const { formatDate } = require('./utils/dateUtils');
const { validateEmail } = require('./utils/validation');
const { calculateTotal } = require('./utils/math');

module.exports = {
  formatDate,
  validateEmail,
  calculateTotal
};