// TODO: This is the existing code that needs to be preserved
// _Commit: 243c66538868c6b87845660312397ab39e0f830d_
// <!-- todo-hash: ... -->

const fs = require('fs');
const main = require('./utilities');

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch) - preserved accessibility enhancements

// TODO: This is the existing code that needs to be preserved
// (This should be preserved)
// Addressed accessibility issues from insight report

const {
  createInPageButton,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  announceToScreenReader,
  handleKeyboardNav,
  newFocusTrap: originNewFocusTrap,
  exportUtils,
  addressAccessibilityIssues,
  handleCredentialResponse,
  ensureElementHasId: ensureElementIdOrigin,
  ensureElementHasId,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  initSkipLink,
  trapFocus
} = main;

// Merged newFocusTrap function from both branches, extending the originNewFocusTrap function
function newFocusTrap(element, customFocusableSelector) {
  const focusableElements = element.querySelectorAll(customFocusableSelector || 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusableElements.length === 0) return;
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });
}

// New announceToScreenReader function from the lower branch
function announceToScreenReader(message, priority) {
  if (priority === undefined) {
    priority = 'polite';
  }
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.position = 'absolute';
  announcer.style.left = '-9999px';
  announcer.textContent = message;
  document.body.appendChild(announcer);
  setTimeout(function () {
    announcer.remove();
  }, 1000);
}

// Assuming harvest and upgrade logic are functions that need to be called
// Implement the harvest logic
function harvest() {
  // Harvest logic here
}

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });
}

const accessibilityUtils = {
  // Existing functions
  // ...
  newFocusTrap,
  announceToScreenReader: function (message, priority) {
    if (priority === undefined) {
      priority = 'polite';
    }
};

/**
 * Spawn an accessibility announcement element
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 * @returns {HTMLElement} The created announcement element
 */
function spawnAnnouncement(message, priority = 'polite') {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(function () {
      announcer.remove();
    }, 1000);
  }
};

const wrapPrimaryContentInMain = () => {
  // Check if a main element already exists
  let mainElement = document.querySelector('main');

  if (!mainElement) {
    // If no main element exists, create one
    mainElement = document.createElement('main');

    // Find the primary content container (commonly #content, .content, #main, .main, or body)
    const contentSelectors = ['#content', '.content', '#main', '.main', 'article', '[role="main"]'];
    let primaryContent = null;

    for (const selector of contentSelectors) {
      primaryContent = document.querySelector(selector);
      if (primaryContent) {
        break;
      }
    }

    // If no specific content container found, use body
    if (!primaryContent) {
      primaryContent = document.body;
    }

    // Move the primary content into the main element
    if (primaryContent !== document.body) {
      mainElement.appendChild(primaryContent);
      document.body.insertBefore(mainElement, document.body.firstChild);
    } else {
      // Wrap all body children except script and style elements
      const children = Array.from(document.body.children);
      children.forEach(child => {
        if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && child.tagName !== 'LINK') {
          mainElement.appendChild(child);
        }
      });
      document.body.insertBefore(mainElement, document.body.firstChild);
    }

    // Add ARIA landmark attribute
    mainElement.setAttribute('role', 'main');

    // Add accessible label if not present
    if (!mainElement.getAttribute('aria-label') && !mainElement.getAttribute('aria-labelledby')) {
      mainElement.setAttribute('aria-label', 'Main content');
    }
  }

  return mainElement;
};

const combinedUtils = Object.assign({}, accessibilityUtils, { focusTrap: newFocusTrap });

// TODO: Implement the new function as per the issue requirements
function newFunction() {
  // Implementation of the new function
}

module.exports = {
  // Export functions for use in other modules
  // ...
  newFocusTrap,
  accessibilityUtils,
  // ...
};