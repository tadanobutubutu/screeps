// main.js

// Accessibility helper function for addressing new accessibility issues from the insight report
function checkAccessibilityCompliance(element) {
  const issues = [];
  
  if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
    issues.push('Element missing accessible name');
  }
  
  if (element.hasAttribute('disabled') && !element.hasAttribute('aria-disabled')) {
    issues.push('Disabled element missing aria-disabled attribute');
  }
  
  if (element.tagName === 'IMG' && !element.hasAttribute('alt')) {
    issues.push('Image missing alt attribute');
  }
  
  if (element.hasAttribute('aria-hidden') && element.tagName === 'BUTTON') {
    issues.push('Button should not be hidden from assistive technology');
  }
  
  return {
    compliant: issues.length === 0,
    issues: issues
  };
}

// TODO: Uncomment the implementation of the function for addressing new accessibility issues from the insight report

module.exports = {
  checkAccessibilityCompliance
};