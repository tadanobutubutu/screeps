// TODO: Address accessibility issues from insight report:

/**
 * Main application module
 * @module main
 */

/**
 * @typedef {Object} AccessibilityConfig
 * @property {boolean} announceActions - Announce actions to screen readers
 * @property {boolean} trapFocus - Trap focus in modals/dialogs
 * @property {string} liveRegionPriority - 'polite' or 'assertive'
 */

/** @type {AccessibilityConfig} */
const defaultConfig = {
  announceActions: true,
  trapFocus: true,
  liveRegionPriority: 'polite'
};

const App = {
  config: { ...defaultConfig },
  
  /**
   * Initialize the application with accessibility support
   */
  init() {
    this.createLiveRegion();
    this.setupEventListeners();
    this.setupKeyboardNavigation();
    this.cacheFocusableElements();
  },

  /**
   * Create ARIA live region for screen reader announcements
   */
  createLiveRegion() {
    let liveRegion = document.getElementById('app-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'app-live-region';
      liveRegion.setAttribute('aria-live', this.config.liveRegionPriority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
      document.body.appendChild(liveRegion);
    }
    this.liveRegion = liveRegion;
  },

  /**
   * Setup event listeners with accessibility considerations
   */
  setupEventListeners() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (target) {
        this.handleAction(target);
      }
    });

    // Handle focus visible for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  },

  /**
   * Setup keyboard navigation with proper focus management
   */
  setupKeyboardNavigation() {
    // Ensure interactive elements are keyboard accessible
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
          if (!target.href && target.type !== 'submit') {
            e.preventDefault();
            target.click();
          }
        }
      }
    });
  },

  /**
   * Cache focusable elements for modal/overlay navigation
   */
  cacheFocusableElements() {
    const selector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    this.focusableElements = Array.from(document.querySelectorAll(selector));
  },

  /**
   * Announce message to screen readers
   * @param {string} message - The message to announce
   * @param {string} [priority] - 'polite' or 'assertive' (overrides config)
   */
  announce(message, priority) {
    if (!this.liveRegion) return;
    
    const ariaPriority = priority || this.config.liveRegionPriority;
    this.liveRegion.setAttribute('aria-live', ariaPriority);
    
    // Clear and set message to trigger announcement
    this.liveRegion.textContent = '';
    requestAnimationFrame(() => {
      this.liveRegion.textContent = message;
    });
  },

  /**
   * Trap focus within a container (useful for modals/dialogs)
   * @param {HTMLElement} container - The container to trap focus within
   * @returns {Function} Function to release focus trap
   */
  trapFocus(container) {
    if (!this.config.trapFocus) return () => {};

    const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableElements = container.querySelectorAll(focusableSelector);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleKeydown = (e) => {
      if (e.key !== 'Tab') return;

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
    };

    container.addEventListener('keydown', handleKeydown);
    
    // Set initial focus
    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeydown);
    };
  },

  /**
   * Handle actions with accessibility improvements
   * @param {HTMLElement} target - The element that triggered the action
   */
  handleAction(target) {
    const action = target.dataset.action;
    const label = target.getAttribute('aria-label') || target.textContent?.trim() || action;
    
    if (this.config.announceActions && label) {
      this.announce(`Action: ${label}`);
    }
  },

  /**
   * Get current focusable elements
   * @returns {NodeList} Array of focusable elements
   */
  getFocusableElements() {
    return this.focusableElements;
  },

  /**
   * Update configuration
   * @param {Partial<AccessibilityConfig>} newConfig - Configuration updates
   */
  configure(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
};

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}

export default App;