// Focus Trap Function for Keyboard Navigation
function focusTrap(container) {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  const focusableElements = container.querySelectorAll(focusableSelectors);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);

  return {
    destroy: function() {
      container.removeEventListener('keydown', handleKeyDown);
    },
    update: function() {
      // Update focusable elements on update
      const updatedFocusable = container.querySelectorAll(focusableSelectors);
      firstElement = updatedFocusable[0];
      lastElement = updatedFocusable[updatedFocusable.length - 1];
    }
  };
}

// TODO: Implement a new function to handle focus trap for keyboard navigation