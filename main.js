document.getElementById('unrotate')?.replaceWith(
  Object.assign(document.createElement('button'), {
    id: 'unrotate',
    textContent: 'rotate back',
    type: 'button'
  })
);
initializeAccessibility();

// ... existing code below ...

function initializeAccessibility() {
  const unrotateBtn = document.getElementById('unrotate');
  if (unrotateBtn) {
    updateAriaAttributes(unrotateBtn, {
      role: 'button',
      'aria-label': 'rotate back'
    });
  }
  // Accessibility initialization logic
  // Example: set up ARIA attributes or focus management
}

function updateAriaAttributes(element, attributes) {
  // Updates ARIA attributes for an element
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

// Existing exports
module.exports = {
  initializeAccessibility,
  updateAriaAttributes,
  // other existing exports...
};

const originalUnrotate = document.getElementById('unrotate');
if (originalUnrotate) {
  originalUnrotate.replaceWith(
    Object.assign(document.createElement('button'), {
      id: 'unrotate',
      textContent: 'rotate back',
      type: 'button'
    })
  );
}
initializeAccessibility();