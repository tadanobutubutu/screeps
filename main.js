// main.js - Browser Extension Entry Point

(function() {
  'use strict';

  // Initialize the extension
  function initialize() {
    console.log('Extension initialized');
    
    // Create an in-page button if the feature is enabled
    const settings = getSettings();
    if (settings.enableButton) {
      const button = createInPageButton({
        text: settings.buttonText || 'Click Me',
        className: 'extension-button',
        position: 'bottom-right'
      });
      
      button.addEventListener('click', function() {
        console.log('In-page button clicked');
        // Handle button click
      });
    }
  }

  // Get extension settings
  function getSettings() {
    return {
      enableButton: true,
      buttonText: 'Open Panel'
    };
  }

  // Create an in-page button
  // TODO: Implement createInPageButton functionality
  function createInPageButton(options = {}) {
    const {
      text = 'Button',
      className = '',
      position = 'bottom-right',
      top,
      right,
      bottom,
      left
    } = options;

    // Create button element
    const button = document.createElement('button');
    button.textContent = text;
    button.className = `in-page-button ${className}`.trim();
    
    // Base styles
    const baseStyles = {
      position: 'fixed',
      zIndex: '2147483647',
      padding: '10px 20px',
      backgroundColor: '#4A90E2',
      color: '#ffffff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      transition: 'background-color 0.2s ease'
    };

    // Position styles
    const positionStyles = {};
    
    if (top !== undefined) positionStyles.top = `${top}px`;
    if (right !== undefined) positionStyles.right = `${right}px`;
    if (bottom !== undefined) positionStyles.bottom = `${bottom}px`;
    if (left !== undefined) positionStyles.left = `${left}px`;
    
    // Handle preset positions
    if (!top && !bottom && !right && !left) {
      switch (position) {
        case 'top-left':
          positionStyles.top = '20px';
          positionStyles.left = '20px';
          break;
        case 'top-right':
          positionStyles.top = '20px';
          positionStyles.right = '20px';
          break;
        case 'bottom-left':
          positionStyles.bottom = '20px';
          positionStyles.left = '20px';
          break;
        case 'bottom-right':
        default:
          positionStyles.bottom = '20px';
          positionStyles.right = '20px';
          break;
      }
    }

    // Apply styles
    const allStyles = { ...baseStyles, ...positionStyles };
    Object.assign(button.style, allStyles);

    // Add hover effect
    button.addEventListener('mouseenter', function() {
      button.style.backgroundColor = '#357ABD';
    });
    
    button.addEventListener('mouseleave', function() {
      button.style.backgroundColor = baseStyles.backgroundColor;
    });

    // Append to page
    document.body.appendChild(button);

    return button;
  }

  // Expose functions globally
  window.createInPageButton = createInPageButton;
  window.inPageButton = {
    create: createInPageButton,
    remove: function(button) {
      if (button && button.parentNode) {
        button.parentNode.removeChild(button);
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Export for module usage (if applicable)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createInPageButton };
  }
})();