// Main entry point for the extension
(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    buttonId: 'in-page-button',
    buttonText: 'Click Me',
    buttonStyles: {
      position: 'fixed',
      top: '10px',
      right: '10px',
      padding: '10px 20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      zIndex: '999999',
      fontSize: '14px'
    }
  };

  /**
   * Creates an in-page button element
   * @param {Object} options - Button configuration options
   * @returns {HTMLButtonElement} The created button element
   */
  function createInPageButton(options = {}) {
    const button = document.createElement('button');
    button.id = options.id || CONFIG.buttonId;
    button.textContent = options.text || CONFIG.buttonText;
    button.setAttribute('type', 'button');

    // Apply styles
    const styles = { ...CONFIG.buttonStyles, ...options.styles };
    Object.entries(styles).forEach(([property, value]) => {
      button.style[property] = value;
    });

    // Add click handler if provided
    if (options.onClick && typeof options.onClick === 'function') {
      button.addEventListener('click', options.onClick);
    }

    return button;
  }

  /**
   * Initializes the in-page button
   */
  function initInPageButton() {
    // Check if button already exists
    if (document.getElementById(CONFIG.buttonId)) {
      console.log('In-page button already exists');
      return;
    }

    const button = createInPageButton({
      onClick: () => {
        console.log('In-page button clicked!');
        // Add your click handler logic here
      }
    });

    document.body.appendChild(button);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInPageButton);
  } else {
    initInPageButton();
  }

  // Export for testing (if in Node environment)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createInPageButton, initInPageButton, CONFIG };
  }
})();