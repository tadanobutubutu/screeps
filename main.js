// TODO: Address accessibility issues from insight report:

// Accessibility utilities module
const accessibilityUtils = {
  // Trap focus within an element (for modals, dialogs, etc.)
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

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
    };

    element.addEventListener('keydown', handleTabKey);
    firstFocusable?.focus();

    return () => element.removeEventListener('keydown', handleTabKey);
  },

  // Announce message to screen readers
  announce(message, priority = 'polite') {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      announcer.textContent = message;
      setTimeout(() => announcer.remove(), 1000);
    }, 100);
  },

  // Handle keyboard navigation for custom components
  handleArrowNavigation(items, currentIndex, key, onSelect) {
    let newIndex = currentIndex;
    const itemCount = items.length;

    if (key === 'ArrowDown' || key === 'ArrowRight') {
      newIndex = (currentIndex + 1) % itemCount;
    } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
      newIndex = (currentIndex - 1 + itemCount) % itemCount;
    } else if (key === 'Home') {
      newIndex = 0;
    } else if (key === 'End') {
      newIndex = itemCount - 1;
    }

    if (newIndex !== currentIndex) {
      onSelect(newIndex);
    }

    return newIndex;
  }
};

// Export utilities
module.exports = {
  accessibilityUtils
};