// main.js

// Accessibility helper function for addressing new accessibility issues from the insight report
function checkAccessibilityCompliance(element) {
  const issues = [];
  
  // REACT_015: Add lang attribute to HTML element
  if (element.tagName === 'HTML' && !element.hasAttribute('lang')) {
    issues.push('HTML element missing lang attribute');
  }
  
  // REACT_017: Add/fix 4 landmark issues
  if (element.hasAttribute('role') && !element.getAttribute('role').includes(' ')) {
    issues.push('Landmark element should have proper labeling');
  }
  
  // REACT_025: Ensure unique landmarks (2 issues)
  if (element.hasAttribute('role') && ['banner', 'navigation', 'main', 'contentinfo', 'complementary'].includes(element.getAttribute('role'))) {
    const sameRoleElements = document.querySelectorAll(`[role="${element.getAttribute('role')}"]`);
    if (sameRoleElements.length > 1) {
      issues.push('Duplicate landmark role found');
    }
  }
  
  // REACT_036: Fix 1 fake link issue
  if ((element.tagName === 'DIV' || element.tagName === 'SPAN') && element.getAttribute('role') === 'link') {
    issues.push('Fake link detected: use an anchor element instead');
  }
  
  if (element.tagName === 'A' && !element.hasAttribute('href') && element.getAttribute('role') !== 'button') {
    issues.push('Anchor element missing href attribute');
  }
  
  if (element.hasAttribute('onclick') && element.tagName !== 'A' && element.tagName !== 'BUTTON') {
    issues.push('Clickable element should be a button or link');
  }
  
  if (element.getAttribute('role') === 'button' && element.tagName !== 'BUTTON' && element.tagName !== 'A') {
    issues.push('Button role should be on a semantic button or link element');
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