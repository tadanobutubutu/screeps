/**
 * Main JavaScript file
 * Handles accessibility improvements and main functionality
 */

// TODO: Implement wrapPrimaryContentInMain function
// Add the new functions for the remaining accessibility issues

// Storage for initialized state
let isInitialized = false;

/**
 * Check if a main element already exists in the document
 * @returns {boolean} - True if main element exists
 */
function hasMainElement() {
  return document.querySelector('main') !== null;
}

/**
 * Find the primary content container in the document
 * Looks for common selectors used for main content areas
 * @returns {Element|null} - The primary content element or null
 */
function findPrimaryContent() {
  // Try common main content selectors
  const selectors = [
    '[role="main"]',
    '#main',
    '#content',
    '#main-content',
    '.main-content',
    '.main',
    '.content',
    'article',
    'section:not([role="navigation"]):not([role="complementary"])'
  ];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      return element;
    }
  }
  
  // Fallback: return body if no specific content found
  return document.body;
}

/**
 * Wrap primary content in a <main> element for accessibility
 * Ensures proper semantic HTML structure
 */
function wrapPrimaryContentInMain() {
  // Return early if main element already exists (only one main per document)
  if (hasMainElement()) {
    return;
  }
  
  const primaryContent = findPrimaryContent();
  
  // Don't wrap if already the body or no valid content
  if (!primaryContent || primaryContent === document.body) {
    return;
  }
  
  // Create the main element
  const mainElement = document.createElement('main');
  
  // Copy inline styles if the element has them
  if (primaryContent.style.cssText) {
    mainElement.style.cssText = primaryContent.style.cssText;
  }
  
  // Copy common attributes
  const className = primaryContent.className;
  const id = primaryContent.id;
  
  // Replace the primary content with the main element
  primaryContent.parentNode.replaceChild(mainElement, primaryContent);
  
  // Move the primary content inside the main element
  mainElement.appendChild(primaryContent);
  
  // Restore className and id to main element if they existed
  if (className) {
    primaryContent.removeAttribute('class');
  }
  if (id) {
    primaryContent.removeAttribute('id');
  }
}

/**
 * Initialize accessibility features
 */
function initAccessibility() {
  if (isInitialized) {
    return;
  }
  
  wrapPrimaryContentInMain();
  
  isInitialized = true;
}

/**
 * Run initialization when DOM is ready
 */
function onDOMReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

// Auto-initialize on DOM ready
onDOMReady(initAccessibility);

// Export functions for testing and external use
module.exports = {
  wrapPrimaryContentInMain,
  hasMainElement,
  findPrimaryContent,
  initAccessibility,
  onDOMReady
};