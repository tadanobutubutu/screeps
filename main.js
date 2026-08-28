// main.js - Accessibility Improvements

/**
 * Initialize accessibility features on DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
  initSkipLink();
  initKeyboardNavigation();
  initAriaLiveRegion();
  initFocusManagement();
  enhanceFormLabels();
  improveModalAccessibility();
  handleReducedMotion();
});

/**
 * Skip Link - Allows keyboard users to skip to main content
 */
function initSkipLink() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  document.body.insertBefore(skipLink, document.body.firstChild);

  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
  }
}

/**
 * Keyboard Navigation - Ensure all interactive elements are keyboard accessible
 */
function initKeyboardNavigation() {
  const interactiveElements = document.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]'
  );

  interactiveElements.forEach((element) => {
    if (!element.hasAttribute('tabindex') && element.tagName !== 'A' && element.tagName !== 'BUTTON') {
      // Ensure focusability
      if (element.hasAttribute('onclick')) {
        element.setAttribute('tabindex', '0');
        element.setAttribute('role', element.getAttribute('role') || 'button');
      }
    }
  });

  // Trap focus inside modals when open
  document.addEventListener('keydown', handleEscapeKey);
}

/**
 * Escape key handler for modals and overlays
 */
function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    const openModal = document.querySelector('.modal[aria-hidden="false"]');
    if (openModal) {
      closeModal(openModal);
    }
  }
}

/**
 * ARIA Live Region - For dynamic content announcements
 */
function initAriaLiveRegion() {
  let liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }
}

/**
 * Announce a message to screen readers
 */
function announceToScreenReader(message) {
  const liveRegion = document.getElementById('aria-live-region');
  if (liveRegion) {
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

/**
 * Focus Management - Manage focus for dynamic content
 */
function initFocusManagement() {
  // Track last focused element before modal opens
  document.addEventListener('click', function (event) {
    const target = event.target.closest('[data-open-modal]');
    if (target) {
      const modalId = target.getAttribute('data-open-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        openModal(modal);
      }
    }
  });
}

/**
 * Open modal with proper focus management
 */
function openModal(modal) {
  modal.setAttribute('aria-hidden', 'false');
  modal.style.display = 'block';
  document.body.classList.add('modal-open');

  const focusable = modal.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable) {
    focusable.focus();
  }

  trapFocus(modal);
  announceToScreenReader('Dialog opened');
}

/**
 * Close modal and restore focus
 */
function closeModal(modal) {
  modal.setAttribute('aria-hidden', 'true');
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');
  announceToScreenReader('Dialog closed');
}

/**
 * Trap focus within an element
 */
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function (event) {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });
}

/**
 * Enhance form labels and validation messaging
 */
function enhanceFormLabels() {
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) {
        input.setAttribute('aria-labelledby', id);
      }
    }

    if (input.hasAttribute('required')) {
      input.setAttribute('aria-required', 'true');
    }
  });

  // Add aria-describedby for help text
  const helpTexts = document.querySelectorAll('[data-help-for]');
  helpTexts.forEach((helpText) => {
    const targetId = helpText.getAttribute('data-help-for');
    const target = document.getElementById(targetId);
    if (target) {
      const existingDescribedBy = target.getAttribute('aria-describedby');
      if (existingDescribedBy) {
        target.setAttribute('aria-describedby', `${existingDescribedBy} ${helpText.id}`);
      } else {
        target.setAttribute('aria-describedby', helpText.id);
      }
    }
  });
}

/**
 * Improve modal accessibility
 */
function improveModalAccessibility() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach((modal) => {
    if (!modal.hasAttribute('role')) {
      modal.setAttribute('role', 'dialog');
    }
    if (!modal.hasAttribute('aria-modal')) {
      modal.setAttribute('aria-modal', 'true');
    }
    if (!modal.hasAttribute('aria-hidden')) {
      modal.setAttribute('aria-hidden', 'true');
    }
  });
}

/**
 * Respect prefers-reduced-motion preference
 */
function handleReducedMotion() {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) {
    document.documentElement.classList.add('reduce-motion');
  }
}

/**
 * Check if a link/URL is accessible via HTTP HEAD/GET request
 */
async function isLinkAccessible(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors'
    });
    
    // In no-cors mode, response.ok is not reliable
    // A successful request without network error means the resource exists
    return true;
  } catch (error) {
    // Try with GET request as fallback
    try {
      const response = await fetch(url, {
        method: 'GET'
      });
      return response.ok;
    } catch (getError) {
      return false;
    }
  }
}

/**
 * Synchronous version that returns a Promise for backward compatibility
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} - Returns true if accessible
 */
function isLinkAccessibleSync(url) {
  return isLinkAccessible(url);
}

// Export functions for testing and utility
module.exports = {
  initSkipLink,
  initKeyboardNavigation,
  handleEscapeKey,
  initAriaLiveRegion,
  announceToScreenReader,
  initFocusManagement,
  openModal,
  closeModal,
  trapFocus,
  enhanceFormLabels,
  improveModalAccessibility,
  handleReducedMotion,
  isLinkAccessible,
  isLinkAccessibleSync
};