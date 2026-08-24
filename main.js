// Addressed accessibility issues from insight report
// Fixed: Added proper ARIA labels, keyboard navigation support, and focus management

// Utility function for focus management
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });
}

// Utility function to announce changes to screen readers
function announceToScreenReader(message, priority = 'polite') {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.setAttribute('class', 'sr-only');
  announcer.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
  announcer.textContent = message;
  document.body.appendChild(announcer);
  setTimeout(() => announcer.remove(), 1000);
}

// Utility function to handle keyboard interactions
function handleKeyboardNav(element, callbacks = {}) {
  element.addEventListener('keydown', function(e) {
    const keyHandlers = {
      'Enter': callbacks.onEnter,
      ' ': callbacks.onSpace,
      'Escape': callbacks.onEscape,
      'ArrowUp': callbacks.onArrowUp,
      'ArrowDown': callbacks.onArrowDown
    };
    
    if (keyHandlers[e.key] && typeof keyHandlers[e.key] === 'function') {
      e.preventDefault();
      keyHandlers[e.key](e);
    }
  });
}

// Utility function to manage roving tabindex
function initRovingTabindex(container, selector = '[role="option"]') {
  const items = container.querySelectorAll(selector);
  items.forEach((item, index) => {
    item.setAttribute('tabindex', index === 0 ? '0' : '-1');
    
    item.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (index + 1) % items.length;
        items[nextIndex].setAttribute('tabindex', '0');
        items[index].setAttribute('tabindex', '-1');
        items[nextIndex].focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (index - 1 + items.length) % items.length;
        items[prevIndex].setAttribute('tabindex', '0');
        items[index].setAttribute('tabindex', '-1');
        items[prevIndex].focus();
      }
    });
  });
}

// Accessible modal/dialog initialization
function initAccessibleModal(modalElement, triggerElement) {
  if (!modalElement || !triggerElement) return;
  
  modalElement.setAttribute('role', 'dialog');
  modalElement.setAttribute('aria-modal', 'true');
  
  if (!modalElement.id) {
    modalElement.id = 'modal-' + Math.random().toString(36).substr(2, 9);
  }
  
  triggerElement.addEventListener('click', () => {
    modalElement.style.display = 'block';
    const focusableElement = modalElement.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElement) {
      focusableElement.focus();
    }
    trapFocus(modalElement);
  });
  
  modalElement.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalElement.style.display = 'none';
      triggerElement.focus();
    }
  });
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    trapFocus,
    announceToScreenReader,
    handleKeyboardNav,
    initRovingTabindex,
    initAccessibleModal,
    prefersReducedMotion
  };
}