// Main application logic

(function() {
  'use strict';
  
  // DOM ready initialization
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Application initialized');
  });
  
  // Existing utility function
  function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  }
  
  // Existing utility function
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(function() {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(function() {
      notification.classList.remove('show');
      setTimeout(function() {
        notification.remove();
      }, 300);
    }, 3000);
  }
  
  // Existing helper function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = function() {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Existing helper function
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() {
          inThrottle = false;
        }, limit);
      }
    };
  }
  
  // TODO: Implement this function for creating in-page buttons
  function createInPageButton(text, onClick, options = {}) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = options.className || 'in-page-button';
    
    if (options.id) {
      button.id = options.id;
    }
    
    if (options.type) {
      button.type = options.type;
    }
    
    if (options.title) {
      button.title = options.title;
    }
    
    if (options.disabled) {
      button.disabled = true;
    }
    
    if (onClick && typeof onClick === 'function') {
      button.addEventListener('click', onClick);
    }
    
    if (options.attributes) {
      Object.keys(options.attributes).forEach(function(key) {
        button.setAttribute(key, options.attributes[key]);
      });
    }
    
    return button;
  }
  
  // Existing function to append button to container
  function appendButtonToContainer(containerSelector, text, onClick, options) {
    const container = document.querySelector(containerSelector);
    if (container) {
      const button = createInPageButton(text, onClick, options);
      container.appendChild(button);
      return button;
    }
    return null;
  }
  
  // Export functions for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      createInPageButton,
      appendButtonToContainer,
      formatDate,
      showNotification,
      debounce,
      throttle
    };
  }
})();