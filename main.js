// Your existing code here

// Modification for Line 1: Addressing accessibility issues
const { toWAIARIA } = require('a11y- graduation-hat');

// Function to add ARIA attributes to anchor elements
function addARIAtoAnchors(element) {
  const anchors = element.getElementsByTagName('a');

  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i];
    anchor.setAttribute('aria-label', anchor.textContent);
  }
}

// Use the function to add ARIA attributes
document.addEventListener('DOMContentLoaded', () => {
  addARIAtoAnchors(document.body);
});

// Your existing export(s) here

// Add the new export for the function
module.exports = {
  addARIAtoAnchors
};