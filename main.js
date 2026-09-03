// main.js - Addressed accessibility issues from insight report

// Accessibility utility functions

/**
 * Creates a screen reader-only text element
 * @param {string} text - The text to announce
 * @returns {HTMLElement} - The span element with sr-only class
 */
function createScreenReaderText(text) {
  const span = document.createElement('span');
  span.className = 'sr-only';
  span.textContent = text;
  return span;
}

/**
 * Announces a message to screen readers using ARIA live regions
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  let announcer = document.getElementById('sr-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
  }
  
  announcer.setAttribute('aria-live', priority);
  
  // Clear and set message with delay to ensure announcement
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
}

/**
 * Manages focus for modal/dialog accessibility
 * @param {HTMLElement} modal - The modal element
 * @param {string} focusTarget - Selector for initial focus target
 */
function trapFocus(modal, focusTarget = null) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  modal.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
    
    if (e.key === 'Escape') {
      modal.dispatchEvent(new CustomEvent('close-modal'));
    }
  });
  
  if (focusTarget) {
    const target = modal.querySelector(focusTarget);
    if (target) target.focus();
  }
}

/**
 * Updates ARIA attributes for expandable/collapsible sections
 * @param {HTMLElement} trigger - The element that triggers expand/collapse
 * @param {HTMLElement} content - The content element
 * @param {boolean} isExpanded - Current expanded state
 */
function updateExpandableAria(trigger, content, isExpanded) {
  trigger.setAttribute('aria-expanded', isExpanded.toString());
  trigger.setAttribute('aria-controls', content.id || `section-${Math.random().toString(36).substr(2, 9)}`);
  content.id = content.id || trigger.getAttribute('aria-controls');
  content.setAttribute('aria-hidden', (!isExpanded).toString());
}

/**
 * Adds keyboard navigation support for custom components
 * @param {HTMLElement} container - Container with navigable items
 * @param {Object} options - Configuration options
 */
function initKeyboardNavigation(container, options = {}) {
  const {
    itemSelector = '[role="option"], [role="menuitem"], li',
    orientation = 'vertical',
    onSelect = () => {},
    onFocus = () => {}
  } = options;
  
  const items = container.querySelectorAll(itemSelector);
  
  items.forEach((item, index) => {
    item.setAttribute('tabindex', item === items[0] ? '0' : '-1');
    
    item.addEventListener('keydown', (e) => {
      let targetIndex = index;
      
      if (orientation === 'vertical') {
        if (e.key === 'ArrowDown') targetIndex = (index + 1) % items.length;
        if (e.key === 'ArrowUp') targetIndex = (index - 1 + items.length) % items.length;
      } else {
        if (e.key === 'ArrowRight') targetIndex = (index + 1) % items.length;
        if (e.key === 'ArrowLeft') targetIndex = (index - 1 + items.length) % items.length;
      }
      
      if (e.key === 'Home') targetIndex = 0;
      if (e.key === 'End') targetIndex = items.length - 1;
      
      if (targetIndex !== index) {
        e.preventDefault();
        items[targetIndex].focus();
        onFocus(items[targetIndex], targetIndex);
      }
      
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(item, index);
      }
    });
  });
}

/**
 * Ensures sufficient color contrast by adding data attributes
 * @param {HTMLElement} element - The element to check
 * @param {string} backgroundColor - Background color
 * @param {string} textColor - Text color
 */
function checkColorContrast(element, backgroundColor, textColor) {
  const contrastRatio = getContrastRatio(backgroundColor, textColor);
  const wcagLevel = contrastRatio >= 7 ? 'AAA' : contrastRatio >= 4.5 ? 'AA' : contrastRatio >= 3 ? 'AA-large' : 'fail';
  element.setAttribute('data-contrast-ratio', contrastRatio.toFixed(2));
  element.setAttribute('data-wcag-level', wcagLevel);
  return wcagLevel;
}

/**
 * Calculates contrast ratio between two colors
 * @param {string} color1 - First color
 * @param {string} color2 - Second color
 * @returns {number} - Contrast ratio
 */
function getContrastRatio(color1, color2) {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculates relative luminance of a color
 * @param {string} color - Color in hex or rgb format
 * @returns {number} - Luminance value
 */
function getLuminance(color) {
  let rgb;
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    rgb = [
      parseInt(hex.substr(0, 2), 16),
      parseInt(hex.substr(2, 2), 16),
      parseInt(hex.substr(4, 2), 16)
    ];
  } else if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    rgb = match ? match.map(Number) : [0, 0, 0];
  } else {
    return 0;
  }
  
  const [r, g, b] = rgb.map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Enhances form inputs with ARIA attributes for better accessibility
 * @param {HTMLElement} input - The input element
 * @param {Object} config - Configuration for accessibility features
 */
function enhanceInputAccessibility(input, config = {}) {
  const {
    required = false,
    invalid = false,
    errorMessage = '',
    label = ''
  } = config;
  
  if (label && !input.getAttribute('aria-label')) {
    input.setAttribute('aria-label', label);
  }
  
  input.setAttribute('aria-required', required.toString());
  input.setAttribute('aria-invalid', invalid.toString());
  
  if (invalid && errorMessage) {
    input.setAttribute('aria-describedby', `${input.id}-error`);
    
    let errorEl = document.getElementById(`${input.id}-error`);
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.id = `${input.id}-error`;
      errorEl.className = 'sr-only';
      errorEl.setAttribute('role', 'alert');
      errorEl.textContent = errorMessage;
      input.parentNode.appendChild(errorEl);
    }
  }
}

// Initialize accessibility features on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Add skip link functionality
  const skipLink = document.querySelector('[href^="#"]');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      const targetId = skipLink.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }
  
  // Enhance all form inputs with accessibility attributes
  document.querySelectorAll('input, select, textarea').forEach(input => {
    const label = input.labels?.[0]?.textContent || input.getAttribute('placeholder') || '';
    enhanceInputAccessibility(input, { label });
  });
  
  console.log('Accessibility enhancements loaded');
});

module.exports = {
  createScreenReaderText,
  announceToScreenReader,
  trapFocus,
  updateExpandableAria,
  initKeyboardNavigation,
  checkColorContrast,
  getContrastRatio,
  getLuminance,
  enhanceInputAccessibility
};