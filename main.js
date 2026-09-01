// TODO: add the new functions or changes requested in the issue

// Accessibility utility: ensure interactive elements are focusable
function ensureFocusable(element) {
  if (element && typeof element.setAttribute === 'function') {
    element.setAttribute('tabindex', '0');
  }
  return element;
}

// Accessibility helper: add ARIA label if missing
function addAriaLabel(element, label) {
  if (element && !element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

// Export new utilities while preserving existing exports
export { ensureFocusable, addAriaLabel };