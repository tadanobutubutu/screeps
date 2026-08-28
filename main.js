// main.js

// Accessibility helper function for addressing new accessibility issues from the insight report
function checkAccessibilityCompliance(element) {
  const issues = [];
  
  // Check if element is missing accessible name
  if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby') && !element.textContent && element.tagName !== 'IMG') {
    issues.push('Element missing accessible name');
  }
  
  // Check if disabled element is missing aria-disabled attribute
  if (element.hasAttribute('disabled') && !element.hasAttribute('aria-disabled')) {
    issues.push('Disabled element missing aria-disabled attribute');
  }
  
  // Check if image is missing alt attribute
  if (element.tagName === 'IMG' && !element.hasAttribute('alt')) {
    issues.push('Image missing alt attribute');
  }
  
  // Check if button is hidden from assistive technology
  if (element.getAttribute('aria-hidden') === 'true' && element.tagName === 'BUTTON') {
    issues.push('Button should not be hidden from assistive technology');
  }
  
  return {
    compliant: issues.length === 0,
    issues: issues
  };
}

module.exports = {
  checkAccessibilityCompliance
};