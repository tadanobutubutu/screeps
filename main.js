/**
 * Main JavaScript file
 */

const app = {
  init: function() {
    console.log('App initialized');
    this.wrapPrimaryContentInMain();
  },

  /**
   * Wraps the primary content in a <main> element
   * This function finds elements with class 'primary-content' or 'content'
   * and wraps them in a <main> tag for semantic HTML structure
   */
  wrapPrimaryContentInMain: function() {
    const primaryContentSelectors = ['.primary-content', '.content', '#main-content', '[role="main"]'];
    
    primaryContentSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        // Check if already wrapped in a main element
        if (element.parentElement.tagName !== 'MAIN') {
          const mainElement = document.createElement('main');
          element.parentNode.insertBefore(mainElement, element);
          mainElement.appendChild(element);
        }
      });
    });
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = app;
}