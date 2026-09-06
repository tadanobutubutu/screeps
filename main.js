// TODO: Address accessibility issues from insight report:

/**
 * Accessibility utility functions for improved a11y compliance
 * Based on insight report recommendations
 */

// ARIA attribute helpers
export function setAriaLabel(element, label) {
  if (element && label) {
    element.setAttribute('aria-label', label);
  }
}

export function setAriaDescribedBy(element, id) {
  if (element && id) {
    element.setAttribute('aria-describedby', id);
  }
}

export function setAriaExpanded(element, expanded) {
  if (element) {
    element.setAttribute('aria-expanded', String(expanded));
  }
}

export function setAriaHidden(element, hidden) {
  if (element) {
    element.setAttribute('aria-hidden', String(hidden));
  }
}

export function setAriaLive(element, politeness = 'polite') {
  if (element) {
    element.setAttribute('aria-live', politeness);
  }
}

export function setAriaControls(element, controlledId) {
  if (element && controlledId) {
    element.setAttribute('aria-controls', controlledId);
  }
}

export function setAriaOwns(element, ownedId) {
  if (element && ownedId) {
    element.setAttribute('aria-owns', ownedId);
  }
}

// Focus management
export function trapFocus(element) {
  if (!element) return () => {};
  
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  function handleTabKey(e) {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  }
  
  element.addEventListener('keydown', handleTabKey);
  firstFocusable?.focus();
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

export function restoreFocus(previousElement) {
  if (previousElement && typeof previousElement.focus === 'function') {
    previousElement.focus();
  }
}

export function getFocusableElements(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
}

// Screen reader announcements
export function announceToScreenReader(message, politeness = 'polite') {
  const announcer = document.getElementById('a11y-announcer') || createAnnouncer();
  announcer.setAttribute('aria-live', politeness);
  announcer.textContent = '';
  
  // Force reflow for screen readers
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
}

function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.id = 'a11y-announcer';
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.position = 'absolute';
  announcer.style.left = '-10000px';
  announcer.style.width = '1px';
  announcer.style.height = '1px';
  announcer.style.overflow = 'hidden';
  document.body.appendChild(announcer);
  return announcer;
}

// Keyboard navigation
export function handleArrowKeyNavigation(e, items, currentIndex, options = {}) {
  const {
    vertical = true,
    horizontal = false,
    wrap = true,
    onSelect = () => {}
  } = options;
  
  let newIndex = currentIndex;
  const length = items.length;
  
  switch (e.key) {
    case 'ArrowDown':
      if (vertical) {
        e.preventDefault();
        newIndex = wrap && currentIndex === length - 1 ? 0 : Math.min(currentIndex + 1, length - 1);
      }
      break;
    case 'ArrowUp':
      if (vertical) {
        e.preventDefault();
        newIndex = wrap && currentIndex === 0 ? length - 1 : Math.max(currentIndex - 1, 0);
      }
      break;
    case 'ArrowRight':
      if (horizontal) {
        e.preventDefault();
        newIndex = wrap && currentIndex === length - 1 ? 0 : Math.min(currentIndex + 1, length - 1);
      }
      break;
    case 'ArrowLeft':
      if (horizontal) {
        e.preventDefault();
        newIndex = wrap && currentIndex === 0 ? length - 1 : Math.max(currentIndex - 1, 0);
      }
      break;
    case 'Home':
      e.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      e.preventDefault();
      newIndex = length - 1;
      break;
    default:
      return currentIndex;
  }
  
  items[newIndex]?.focus();
  onSelect(newIndex);
  return newIndex;
}

// Reduced motion support
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function onReducedMotionChange(callback) {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

// Color contrast utilities
export function getLuminance(r, g, b) {
  const srgb = [r, g, b].map(val => {
    const c = val / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

export function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(...color1);
  const lum2 = getLuminance(...color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function meetsContrastRatio(foreground, background, level = 'AA', size = 'normal') {
  const ratio = getContrastRatio(foreground, background);
  const thresholds = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 }
  };
  return ratio >= thresholds[level][size];
}

// Form accessibility
export function associateLabelWithInput(labelElement, inputElement) {
  if (!labelElement || !inputElement) return;
  
  const id = inputElement.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  inputElement.id = id;
  labelElement.setAttribute('for', id);
}

export function setRequiredAttribute(element, required = true) {
  if (element) {
    element.setAttribute('aria-required', String(required));
    if (required) {
      element.setAttribute('required', '');
    } else {
      element.removeAttribute('required');
    }
  }
}

export function setInvalidState(element, isInvalid, errorMessage = '') {
  if (!element) return;
  
  element.setAttribute('aria-invalid', String(isInvalid));
  
  if (isInvalid && errorMessage) {
    const errorId = `${element.id}-error`;
    let errorElement = document.getElementById(errorId);
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = errorId;
      errorElement.setAttribute('role', 'alert');
      errorElement.className = 'sr-only';
      element.parentNode?.insertBefore(errorElement, element.nextSibling);
    }
    
    errorElement.textContent = errorMessage;
    element.setAttribute('aria-describedby', errorId);
  } else {
    const errorId = `${element.id}-error`;
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.remove();
    }
    element.removeAttribute('aria-describedby');
  }
}

// Skip link utility
export function createSkipLink(targetId, text = 'Skip to main content') {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.5rem 1rem;
    background: #000;
    color: #fff;
    z-index: 10000;
    text-decoration: none;
  `;
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-100%';
  });
  
  return skipLink;
}

// Initialize skip link on page load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('main') || document.querySelector('main');
    if (main && !main.id) {
      main.id = 'main';
    }
    
    if (main && !document.querySelector('.skip-link')) {
      const skipLink = createSkipLink('main');
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
  });
}

export default {
  setAriaLabel,
  setAriaDescribedBy,
  setAriaExpanded,
  setAriaHidden,
  setAriaLive,
  setAriaControls,
  setAriaOwns,
  trapFocus,
  restoreFocus,
  getFocusableElements,
  announceToScreenReader,
  handleArrowKeyNavigation,
  prefersReducedMotion,
  onReducedMotionChange,
  getLuminance,
  getContrastRatio,
  meetsContrastRatio,
  associateLabelWithInput,
  setRequiredAttribute,
  setInvalidState,
  createSkipLink
};