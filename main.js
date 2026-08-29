// TODO: Address accessibility issues from insight report: add aria attributes

/**
 * Initialize accessibility improvements
 */
function initAccessibility() {
  // Add aria-labels to icon-only buttons
  document.querySelectorAll('button').forEach(button => {
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      const icon = button.querySelector('svg, img, [class*="icon"], [class*="fa-"]');
      if (icon) {
        const iconText = icon.getAttribute('aria-label') || icon.title || 'Button';
        button.setAttribute('aria-label', iconText);
      }
    }
  });

  // Ensure form inputs have associated labels
  document.querySelectorAll('input, select, textarea').forEach(input => {
    if (!input.id && !input.getAttribute('aria-label')) {
      const label = input.previousElementSibling;
      if (label && (label.tagName === 'LABEL' || label.getAttribute('for'))) {
        if (label.id) {
          input.setAttribute('aria-labelledby', label.id);
        } else {
          const generatedId = `input-${Math.random().toString(36).substr(2, 9)}`;
          label.id = generatedId;
          input.setAttribute('aria-labelledby', generatedId);
        }
      }
    }
  });

  // Add role="navigation" to nav elements if not present
  document.querySelectorAll('nav').forEach(nav => {
    if (!nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
  });

  // Add aria-hidden to decorative elements
  document.querySelectorAll('.decorative, [aria-hidden="true"]').forEach(el => {
    // Already has aria-hidden, ensure it's correct
    if (!el.getAttribute('aria-hidden')) {
      el.setAttribute('aria-hidden', 'true');
    }
  });
}

// Export functions for testing
export { initAccessibility };

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}