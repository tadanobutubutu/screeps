// TODO: Address accessibility issues from insight report: add ARIA attributes

// Example: Set ARIA attributes on interactive elements
function setAriaAttributes(element, attributes) {
  if (!element) return;
  
  Object.keys(attributes).forEach(key => {
    element.setAttribute(key, attributes[key]);
  });
}

// Example: Add accessibility to buttons
function initAccessibleButtons() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', `Button ${index + 1}`);
    }
    if (button.disabled) {
      button.setAttribute('aria-disabled', 'true');
    }
  });
}

// Example: Add accessibility to form inputs
function initAccessibleForms() {
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    if (input.required && !input.getAttribute('aria-required')) {
      input.setAttribute('aria-required', 'true');
    }
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label && !input.getAttribute('aria-describedby')) {
      input.setAttribute('aria-describedby', `${input.id}-description`);
    }
  });
}

// Example: Add accessibility to expandable/collapsible elements
function initAccessibleToggles() {
  const toggles = document.querySelectorAll('[data-toggle]');
  toggles.forEach(toggle => {
    const targetId = toggle.getAttribute('data-toggle');
    const target = document.getElementById(targetId);
    if (target) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', targetId);
      toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        target.hidden = isExpanded;
      });
    }
  });
}

// Initialize all accessibility features
function initAccessibility() {
  initAccessibleButtons();
  initAccessibleForms();
  initAccessibleToggles();
}

// Export functions for use elsewhere
export {
  setAriaAttributes,
  initAccessibleButtons,
  initAccessibleForms,
  initAccessibleToggles,
  initAccessibility
};

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}