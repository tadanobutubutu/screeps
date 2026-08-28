// TODO: Address accessibility issues from insight report:
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Accessibility improvements
function focusableElements() {
  return [
    'a[href]',
    'area[href]',
    'input:not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]'
  ];
}

function addAriaAttributes(element, attributes = {}) {
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(key, value);
    }
  });
}

// Apply accessibility enhancements to focusable elements on page load
document.addEventListener('DOMContentLoaded', () => {
  focusableElements().forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      if (el instanceof HTMLElement) {
        addAriaAttributes(el, {
          role: 'button',
          tabIndex: -1
        });
      }
    });
  });
});

export { focusableElements, addAriaAttributes };