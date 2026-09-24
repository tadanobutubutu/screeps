// TODO: Existing main.js content before the merge conflict...

function checkLinkAndButtonAccessibility() {
  const issues = [];
  const links = document.querySelectorAll('a');
  const buttons = document.querySelectorAll('button');

  links.forEach((link, index) => {
    const hasText = link.textContent.trim() !== '';
    const hasAriaLabel = link.getAttribute('aria-label') !== null;
    const hasTitle = link.getAttribute('title') !== null;
    const hasImgWithAlt = link.querySelector('img[alt]') !== null;

    if (!hasText && !hasAriaLabel && !hasTitle && !hasImgWithAlt) {
      issues.push({
        type: 'link',
        element: link,
        index: index
      });
    }
  });

  buttons.forEach((button, index) => {
    const hasText = button.textContent.trim() !== '';
    const hasAriaLabel = button.getAttribute('aria-label') !== null;
    const hasTitle = button.getAttribute('title') !== null;
    const hasImgWithAlt = button.querySelector('img[alt]') !== null;

    if (!hasText && !hasAriaLabel && !hasTitle && !hasImgWithAlt) {
      issues.push({
        type: 'button',
        element: button,
        index: index
      });
    }
  });

  return issues;
}

function calculateSum(a, b) {
  return a + b;
}

function calculateProduct(a, b) {
  return a * b;
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { addressAccessibilityIssues, calculateSum, calculateProduct };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
}