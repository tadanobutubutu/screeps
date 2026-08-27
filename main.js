// TODO: Address accessibility issues from insight report

// Preserve all existing functions and exports

// Accessibility helper function to announce messages to screen readers
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Trap focus within an element (for modals, dialogs, etc.)
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
    if (e.key === 'Escape') {
      element.dispatchEvent(new CustomEvent('close-modal'));
    }
  }

  element.addEventListener('keydown', handleKeyDown);
  return () => element.removeEventListener('keydown', handleKeyDown);
}

// Get readable contrast color
function getContrastColor(hexColor) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Check if user prefers high contrast
function prefersHighContrast() {
  return window.matchMedia('(prefers-contrast: more)').matches;
}

// Validate color contrast ratio meets WCAG AA (4.5:1 for normal text)
function meetsContrastRequirements(foreground, background, level = 'AA') {
  const getLuminance = (color) => {
    const rgb = color.match(/[A-Fa-f0-9]{2}/g).map(x => parseInt(x, 16) / 255);
    const [r, g, b] = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const contrast = (lighter + 0.05) / (darker + 0.05);

  return level === 'AAA' ? contrast >= 7 : contrast >= 4.5;
}

// Add keyboard accessibility to interactive elements
function setupKeyboardNavigation(container = document) {
  container.querySelectorAll('[data-accessible-click]').forEach(element => {
    element.setAttribute('tabindex', '0');
    element.setAttribute('role', element.getAttribute('data-accessible-role') || 'button');
    
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      element.setAttribute('aria-label', element.textContent.trim());
    }
  });
}

// Export functions for use in other modules
export {
  announceToScreenReader,
  trapFocus,
  getContrastColor,
  prefersReducedMotion,
  prefersHighContrast,
  meetsContrastRequirements,
  setupKeyboardNavigation
};