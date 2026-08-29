// TODO: Any additional changes requested in the issue

function addAccessibilityAttribute(elementId, attributeName, attributeValue) {
  const element = document.getElementById(elementId);

  if (element) {
    element.setAttribute(attributeName, attributeValue);
  }
}

// Usage:
// addAccessibilityAttribute('myElementId', 'aria-label', 'My accessible label');
addAccessibilityAttribute('myElementId', 'aria-label', 'My accessible label'); // Example usage

// Preserve the existing export(s) if any
// ...