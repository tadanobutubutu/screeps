/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// TODO: This is the existing code that needs to be preserved

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

/**
 * Selector for focusable elements that should be included in the focus trap
 */
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

/**
 * Gets all focusable elements within a container
 * @param {HTMLElement} container - The container element to search within
 * @returns {HTMLElement[]} Array of focusable elements sorted by tabindex
 */
function getFocusableElements(container) {
  if (!container) return [];
  
  const elements = Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS));
  
  // Sort by tabindex attribute (elements without tabindex come first, then by numeric value)
  return elements.sort((a, b) => {
    const aIndex = a.getAttribute('tabindex') || 0;
    const bIndex = b.getAttribute('tabindex') || 0;
    return parseInt(aIndex, 10) - parseInt(bIndex, 10);
  });
}

/**
 * Handles keydown events for focus trap functionality
 * @param {KeyboardEvent} event - The keyboard event
 * @param {HTMLElement} container - The trapped container element
 * @returns {boolean} Returns true if focus was trapped, false otherwise
 */
function handleFocusTrapKeydown(event, container) {
  if (event.key !== 'Tab') return false;
  
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length === 0) return false;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;
  
  // Handle Shift + Tab: Move to last element when focusing backwards from first
  if (event.shiftKey && activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return true;
  }
  
  // Handle Tab: Move to first element when focusing forwards from last
  if (!event.shiftKey && activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
    return true;
  }
  
  return false;
}

/**
 * Activates focus trap on a container element
 * @param {HTMLElement} container - The container element to trap focus within
 * @returns {Object} Object with deactivate method to remove the focus trap
 */
function activateFocusTrap(container) {
  if (!container) {
    throw new Error('Focus trap container must be a valid DOM element');
  }
  
  const trapHandler = (event) => handleFocusTrapKeydown(event, container);
  
  container.addEventListener('keydown', trapHandler);
  
  // Optionally focus the first focusable element when trap is activated
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
  
  return {
    deactivate: function() {
      container.removeEventListener('keydown', trapHandler);
    }
  };
}

/**
 * Creates and starts the HTTP server
 * @returns {http.Server} The created server instance
 */
function createServer() {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', config }));
  });
  return server;
}

/**
 * Starts the application
 */
function startApp() {
  const server = createServer();
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
  return server;
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  activateFocusTrap,
  handleFocusTrapKeydown,
  getFocusableElements,
  FOCUSABLE_SELECTORS
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}