// TODO: Address accessibility issues from insight report:
// - Ensure all interactive elements are keyboard accessible
// - Add proper ARIA labels where needed
// - Ensure color contrast meets WCAG guidelines
// - Add skip links and focus management
// - Ensure form inputs have proper labels

/**
 * Main application entry point
 * Provides accessible UI components and interactions
 */

const App = {
  initialized: false,
  
  init() {
    if (this.initialized) return;
    
    // Ensure DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
    
    this.initialized = true;
  },
  
  setup() {
    // Initialize skip link for keyboard users
    this.setupSkipLink();
    
    // Setup accessible navigation
    this.setupNavigation();
    
    // Setup form accessibility
    this.setupForms();
    
    // Setup keyboard interactions
    this.setupKeyboardNav();
    
    console.log('App initialized with accessibility support');
  },
  
  setupSkipLink() {
    // Create skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = 'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;';
    skipLink.addEventListener('focus', function() {
      this.style.cssText = 'position:static;width:auto;height:auto;padding:10px;background:#fff;';
    });
    skipLink.addEventListener('blur', function() {
      this.style.cssText = 'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
  },
  
  setupNavigation() {
    const nav = document.querySelector('nav');
    if (nav) {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Main navigation');
    }
    
    const menuToggle = document.querySelector('[aria-haspopup="true"]');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
      });
    }
  },
  
  setupForms() {
    // Ensure all form inputs have associated labels
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      const id = input.id || input.name;
      if (id && !document.querySelector(`label[for="${id}"]`)) {
        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
        label.textContent = input.placeholder || 'Form field';
        input.parentNode.insertBefore(label, input);
      }
      
      // Mark required fields appropriately
      if (input.hasAttribute('required')) {
        input.setAttribute('aria-required', 'true');
      }
    });
  },
  
  setupKeyboardNav() {
    // Make custom interactive elements keyboard accessible
    const clickableElements = document.querySelectorAll('[role="button"], [role="menuitem"]');
    clickableElements.forEach(el => {
      el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
    
    // Manage focus for modal/dialog accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close any open modals
        const activeModal = document.querySelector('[role="dialog"]:focus-within');
        if (activeModal) {
          activeModal.setAttribute('aria-hidden', 'true');
        }
      }
    });
  },
  
  // Utility: Announce dynamic content changes to screen readers
  announce(message, priority = 'polite') {
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = 'position:absolute;left:-9999px;';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  }
};

// Initialize app
App.init();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App };
}