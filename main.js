// main.js
// Updated to import and use dependencyGraphContent and indexContent

import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// Existing functions (preserved)
// ... (any other imports and functions remain unchanged)

/**
 * Renders the dependency graph view.
 * Updated to use dependencyGraphContent.
 */
export function renderDependencyGraph() {
  // Example usage: replace with actual rendering logic
  console.log('Rendering dependency graph', dependencyGraphContent);
}

/**
 * Renders the index view.
 * Updated to use indexContent.
 */
export function renderIndex() {
  // Example usage: replace with actual rendering logic
  console.log('Rendering index', indexContent);
}

// Any other existing code remains unchanged

// Function to render index view using indexContent
function renderIndexView(container) {
  const doc = getDocument();
  if (!doc || !container) return null;
  
  return indexContent(doc, container);
}

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(lang = 'en') {
  const doc = getDocument();
  if (doc && doc.documentElement) {
    if (doc.documentElement.lang !== lang) {
      doc.documentElement.lang = lang;
    }
  }
}

// REACT_025: Add additional accessibility changes as per insight report
function updateAriaAttributes() {
  const doc = getDocument();
  if (doc) {
    const body = doc.body;
    if (body && !body.hasAttribute('role')) {
      body.setAttribute('role', 'document');
    }
  }
}

// Implement the handleErrorState function to handle the new accessibility issue
function handleErrorState(errorElement, container, trigger = false) {
  if (!errorElement) return;

  const doc = getDocument();
  if (!doc) return;

  // Wrap the error in a <section> element
  const errorSection = doc.createElement('section');
  errorSection.setAttribute('role', 'alert');
  errorSection.setAttribute('aria-live', 'assertive');
  
  if (typeof errorElement === 'string') {
    errorSection.textContent = errorElement;
  } else if (errorElement instanceof HTMLElement) {
    errorSection.innerHTML = '';
    errorSection.appendChild(errorElement);
  } else {
    errorSection.textContent = String(errorElement);
  }

  if (container) {
    const errorContainer = doc.createElement('div');
    errorContainer.setAttribute('class', 'error-container');
    errorContainer.setAttribute('role', 'alert');
    errorContainer.appendChild(errorSection);
    container.appendChild(errorContainer);
  }

  // If trigger is true, trigger the accessibility mode
  if (trigger) {
    triggerAccessibilityMode();
  }
}

// Implement the handleAccessibilityError function that wraps handleErrorState with triggering the accessibility mode
function handleAccessibilityError(errorElement, container) {
  handleErrorState(errorElement, container, true);
}

// Function to trigger accessibility mode
function triggerAccessibilityMode() {
  const doc = getDocument();
  if (doc) {
    const html = doc.documentElement;
    if (html) {
      html.setAttribute('data-accessibility-mode', 'enabled');
    }
  }
}

// Implementation for checking link accessibility
function isLinkAccessible(link) {
  if (!link || typeof link !== 'object') {
    return false;
  }

  const doc = getDocument();
  if (!doc) return false;

  if (!(link instanceof doc.defaultView.Element) && link.nodeType !== 1) {
    return false;
  }

  if (link.hasAttribute('href')) {
    const href = link.getAttribute('href');
    if (href === null || href === '' || href === '#' || href === 'javascript:void(0)' || href === 'javascript:void(0);') {
      return false;
    }
    return true;
  }

  return false;
}

// Export the existing handleErrorState function
export { handleErrorState };

// Export the new handleAccessibilityError function
export { handleAccessibilityError };

// Export addLangAttribute function
export { addLangAttribute };

// Export the new functions/modules if needed
export { updateAriaAttributes };
export { triggerAccessibilityMode };

// Export functions that render dependency graphs and index views
export { renderDependencyGraph };
export { renderIndexView };

// Export the new isLinkAccessible function
export { isLinkAccessible };