// TODO: Address accessibility issues from insight report

/**
 * Announces a message to screen readers via an aria-live region
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  let liveRegion = document.getElementById('sr-announcer');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'sr-announcer';
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
    document.body.appendChild(liveRegion);
  }
  
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);
}

/**
 * Manages focus for modal dialogs and interactive elements
 * @param {HTMLElement} container - The container to trap focus within
 */
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
  
  firstElement?.focus();
}

/**
 * Returns focus to a previously stored element
 * @param {HTMLElement} previousElement - The element to return focus to
 */
function returnFocus(previousElement) {
  if (previousElement && typeof previousElement.focus === 'function') {
    previousElement.focus();
  }
}

/**
 * Reduces motion for users with prefers-reduced-motion
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Handles keyboard navigation for custom components
 * @param {HTMLElement} element - The element to attach keyboard handling to
 * @param {Object} options - Configuration options
 */
function handleKeyboardNav(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  element.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        onEnter?.(e);
        break;
      case 'Escape':
        onEscape?.(e);
        break;
      case 'ArrowUp':
        onArrowUp?.(e);
        break;
      case 'ArrowDown':
        onArrowDown?.(e);
        break;
    }
  });
}

/**
 * Ensures proper ARIA attributes are set for expandable sections
 * @param {HTMLElement} trigger - The element that triggers expand/collapse
 * @param {HTMLElement} content - The content that shows/hides
 */
function setupExpandableSection(trigger, content) {
  const expandedId = `expanded-${Math.random().toString(36).substr(2, 9)}`;
  const controlsId = `controls-${Math.random().toString(36).substr(2, 9)}`;
  
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', controlsId);
  content.id = controlsId;
  content.setAttribute('aria-hidden', 'true');
  
  trigger.addEventListener('click', () => {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', !isExpanded);
    content.setAttribute('aria-hidden', isExpanded);
    
    if (!isExpanded) {
      content.style.display = 'block';
      announceToScreenReader('Section expanded');
    } else {
      content.style.display = 'none';
      announceToScreenReader('Section collapsed');
    }
  });
}