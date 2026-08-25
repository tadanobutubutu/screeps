// TODO: Address accessibility issues from insight report

/**
 * Main application entry point
 * @module main
 */

(function() {
  'use strict';

  /**
   * Initialize the application
   * @function initialize
   * @returns {void}
   */
  function initialize() {
    console.log('Application initialized');
  }

  /**
   * Handle user interactions with accessibility support
   * @function handleInteraction
   * @param {Event} event - The DOM event
   * @returns {void}
   */
  function handleInteraction(event) {
    const target = event.target;
    
    // Ensure focus is visible for keyboard users
    if (target.matches('button, a, input, [tabindex]')) {
      target.setAttribute('aria-pressed', 'false');
      
      target.addEventListener('focus', function() {
        this.style.outline = '2px solid #0066cc';
        this.style.outlineOffset = '2px';
      }, { once: true });
      
      target.addEventListener('blur', function() {
        this.style.outline = 'none';
      }, { once: true });
    }
  }

  /**
   * Create accessible notification message
   * @function announceToScreenReader
   * @param {string} message - The message to announce
   * @param {string} [priority='polite'] - Announcement priority (polite or assertive)
   * @returns {void}
   */
  function announceToScreenReader(message, priority) {
    const polite = priority !== 'assertive';
    const liveRegion = document.createElement('div');
    
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', polite ? 'polite' : 'assertive');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.padding = '0';
    liveRegion.style.margin = '-1px';
    liveRegion.style.overflow = 'hidden';
    liveRegion.style.clip = 'rect(0, 0, 0, 0)';
    liveRegion.style.whiteSpace = 'nowrap';
    liveRegion.style.border = '0';
    
    document.body.appendChild(liveRegion);
    
    // Timeout to ensure screen reader picks up the change
    setTimeout(function() {
      liveRegion.textContent = message;
    }, 100);
    
    // Clean up after announcement
    setTimeout(function() {
      document.body.removeChild(liveRegion);
    }, 1000);
  }

  // Expose functions globally for testing
  if (typeof window !== 'undefined') {
    window.main = {
      initialize: initialize,
      handleInteraction: handleInteraction,
      announceToScreenReader: announceToScreenReader
    };
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initialize();
      document.addEventListener('click', handleInteraction);
      document.addEventListener('keydown', handleInteraction);
    });
  } else {
    initialize();
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
  }

  // CommonJS export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      initialize: initialize,
      handleInteraction: handleInteraction,
      announceToScreenReader: announceToScreenReader
    };
  }
})();