// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// New function added as per the issue
function newFunction() {
  // Implementation details go here
}

// New function as per the issue request
function newFunction() {
  // New function implementation
}

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: fixLandmarkIssues, addMainLandmark, addLandmarkRegions)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks, uniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames, addAccessibleNamesToSVGs)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue, fixFakeLinkIssues)
// - REACT_037: Google sign-in logic (DONE: googleSignIn)
// - REACT_040: Replace my-button with actual button id for accessibility (DONE: fixButtonIdentifiers)
// - REACT_042: Ensure dependencyGraph container has proper ARIA role (DONE: ensureDependencyGraphAriaRole)

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Original code goes here
// ----- END ORIGINAL CODE -----

/**
 * Add lang attribute to HTML element for accessibility
 * @param {Document} doc - The document object
 * @param {string} lang - Language code (e.g., 'en', 'es')
 */
function addLangAttribute(doc, lang = 'en') {
  const html = doc.documentElement;
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
  return html;
}

/**
 * Fix table structure issues for accessibility
 * @param {Document} doc - The document object
 */
function fixTableStructure(doc) {
  const tables = doc.querySelectorAll('table');
  tables.forEach((table) => {
    // Ensure tables have proper semantic structure
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = doc.createElement('thead');
        const tbody = table.querySelector('tbody');
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, tbody || table.firstChild);
        firstRow.remove();
      }
    }
  });
  return tables.length;
}

/**
 * Add main landmark to the document
 * @param {Document} doc - The document object
 */
function addMainLandmark(doc) {
  const existingMain = doc.querySelector('main');
  if (!existingMain) {
    const body = doc.body;
    if (body) {
      const main = doc.createElement('main');
      main.setAttribute('role', 'main');
      // Move content into main
      while (body.firstChild) {
        main.appendChild(body.firstChild);
      }
      body.appendChild(main);
    }
  }
  return doc.querySelector('main');
}

/**
 * Add landmark regions to the document
 * @param {Document} doc - The document object
 */
function addLandmarkRegions(doc) {
  const landmarks = ['header', 'nav', 'main', 'footer'];
  landmarks.forEach((landmark) => {
    const elements = doc.querySelectorAll(landmark);
    elements.forEach((el) => {
      if (!el.getAttribute('role') && !el.tagName.toLowerCase() === landmark) {
        el.setAttribute('role', landmark.charAt(0).toUpperCase() + landmark.slice(1));
      }
    });
  });
}

/**
 * Ensure unique landmarks in the document
 * @param {Document} doc - The document object
 * @returns {Array} Array of duplicate landmarks
 */
function ensureUniqueLandmarks(doc) {
  const landmarks = doc.querySelectorAll('[role], header, nav, main, aside, footer');
  const seen = new Map();
  const duplicates = [];
  
  landmarks.forEach((el) => {
    const role = el.getAttribute('role') || el.tagName.toLowerCase();
    if (seen.has(role)) {
      duplicates.push({ element: el, role });
      // Remove duplicate landmark role, keep as generic container
      if (el.hasAttribute('role')) {
        el.removeAttribute('role');
      }
    } else {
      seen.set(role, el);
    }
  });
  
  return duplicates;
}

/**
 * Alias for ensureUniqueLandmarks for compatibility
 * @param {Document} doc - The document object
 */
function uniqueLandmarks(doc) {
  return ensureUniqueLandmarks(doc);
}

/**
 * Fix landmark issues by ensuring proper landmark structure
 * @param {Document} doc - The document object
 */
function fixLandmarkIssues(doc) {
  addMainLandmark(doc);
  addLandmarkRegions(doc);
  ensureUniqueLandmarks(doc);
}

/**
 * Add accessible names to SVG elements
 * @param {Element} svg - The SVG element
 * @param {string} name - The accessible name
 */
function addSvgAccessibleNames(svg, name) {
  if (svg && svg.tagName && svg.tagName.toLowerCase() === 'svg') {
    // Add aria-label
    svg.setAttribute('aria-label', name);
    // Add title element if not present
    if (!svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = name;
      svg.insertBefore(title, svg.firstChild);
    }
  }
}

/**
 * Add accessible names to all SVGs in the document
 * @param {Document} doc - The document object
 */
function addAccessibleNamesToSVGs(doc) {
  const svgs = doc.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      addSvgAccessibleNames(svg, `SVG Icon ${index + 1}`);
    }
  });
  return svgs.length;
}

/**
 * Fix fake link issues (links that don't go anywhere)
 * @param {Document} doc - The document object
 */
function fixFakeLinkIssues(doc) {
  const links = doc.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  links.forEach((link) => {
    const onclick = link.getAttribute('onclick');
    const role = link.getAttribute('role');
    // If it's a fake link (using onclick as navigation), add button role or make it a button
    if ((onclick && !link.hasAttribute('href')) || role === 'link') {
      // Convert to button if appropriate
      link.setAttribute('role', 'button');
    }
  });
  return links.length;
}

/**
 * Fix a single fake link issue
 * @param {Element} link - The link element
 */
function fixFakeLinkIssue(link) {
  if (link && link.tagName.toLowerCase() === 'a') {
    if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
      link.setAttribute('role', 'button');
    }
  }
  return link;
}

/**
 * Handle Google sign-in logic with accessibility considerations
 * @param {Object} options - Sign-in options
 * @returns {Promise} Promise resolving to sign-in result
 */
function googleSignIn(options = {}) {
  return new Promise((resolve, reject) => {
    // Accessibility: Ensure sign-in button has proper labeling
    const { buttonId = 'google-signin-button' } = options;
    const button = document.getElementById(buttonId);
    if (button) {
      if (!button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', 'Sign in with Google');
      }
      if (!button.textContent.trim()) {
        button.textContent = 'Sign in with Google';
      }
    }
    
    // Proceed with sign-in logic
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize(options);
      if (button) {
        google.accounts.id.renderButton(button, options);
      }
      resolve({ success: true, button });
    } else {
      reject(new Error('Google Sign-In not available'));
    }
  });
}

/**
 * Fix button identifiers for accessibility
 * @param {Document} doc - The document object
 */
function fixButtonIdentifiers(doc) {
  // Fix any buttons with generic 'my-button' id
  const buttons = doc.querySelectorAll('button[id="my-button"], [role="button"][id="my-button"]');
  buttons.forEach((button, index) => {
    const newId = `action-button-${index + 1}`;
    button.setAttribute('id', newId);
    // Ensure button has accessible name
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', `Button ${index + 1}`);
    }
  });
  return buttons.length;
}

/**
 * Ensure dependencyGraph container has proper ARIA role
 * @param {Document} doc - The document object
 * @returns {Element|null} The dependencyGraph container with ARIA role
 */
function ensureDependencyGraphAriaRole(doc) {
  const container = doc.querySelector('#dependencyGraph, .dependency-graph, [data-dependency-graph]');
  if (container) {
    if (!container.getAttribute('role')) {
      container.setAttribute('role', 'region');
    }
    if (!container.getAttribute('aria-label')) {
      container.setAttribute('aria-label', 'Dependency Graph');
    }
  }
  return container;
}

/**
 * Handle focus trap for keyboard navigation
 * Traps keyboard focus within a container element for accessibility
 * @param {Element} container - The container element to trap focus within
 * @param {Object} options - Options for the focus trap
 * @param {boolean} options.returnFocus - Whether to return focus to the previously focused element when deactivated (default: true)
 * @param {boolean} options.escapeKey - Whether Escape key triggers deactivation callback (default: true)
 * @param {Function} options.onEscape - Callback function called when Escape is pressed
 * @param {boolean} options.initialFocus - Whether to set initial focus to first focusable element (default: true)
 * @param {boolean} options.autoActivate - Whether to automatically activate the trap on creation (default: false)
 * @returns {Object} Object with activate, deactivate, and state methods
 */
function focusTrap(container, options = {}) {
  const {
    returnFocus = true,
    escapeKey = true,
    onEscape = null,
    initialFocus = true,
    autoActivate = false
  } = options;

  let previousActiveElement = null;
  let active = false;

  /**
   * Get all focusable elements within a container
   * @param {Element} element - The container element
   * @returns {Array} Array of focusable elements
   */
  const getFocusableElements = (element) => {
    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      'details > summary'
    ];

    const focusableElements = Array.from(element.querySelectorAll(focusableSelectors.join(',')));
    
    // Filter to only visible elements
    return focusableElements.filter((el) => {
      return el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
    });
  };

  /**
   * Handle keydown events to trap focus
   * @param {KeyboardEvent} event - The keyboard event
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        // Shift + Tab: move backwards
        if (activeElement === firstElement || !container.contains(activeElement)) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: move forwards
        if (activeElement === lastElement || !container.contains(activeElement)) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    } else if (event.key === 'Escape' && escapeKey) {
      if (onEscape && typeof onEscape === 'function') {
        onEscape(event);
      }
    }
  };

  /**
   * Activate the focus trap
   * @param {FocusableElement} initialFocusElement - Optional element to focus first
   */
  const activate = (initialFocusElement = null) => {
    if (active) return;

    previousActiveElement = document.activeElement;
    active = true;
    container.addEventListener('keydown', handleKeyDown);

    // Ensure container can receive focus if no focusable elements
    if (!container.hasAttribute('tabindex')) {
      container.setAttribute('tabindex', '-1');
    }

    // Set initial focus
    if (initialFocus) {
      const focusableElements = getFocusableElements(container);
      
      if (initialFocusElement && container.contains(initialFocusElement)) {
        initialFocusElement.focus();
      } else if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        container.focus();
      }
    }
  };

  /**
   * Deactivate the focus trap and optionally return focus
   */
  const deactivate = () => {
    if (!active) return;

    active = false;
    container.removeEventListener('keydown', handleKeyDown);

    // Return focus to the previously focused element
    if (returnFocus && previousActiveElement && previousActiveElement.focus) {
      try {
        previousActiveElement.focus();
      } catch (e) {
        // Element may no longer be in DOM, silently fail
      }
    }
  };

  /**
   * Check if the focus trap is currently active
   * @returns {boolean} Whether the trap is active
   */
  const isActive = () => active;

  /**
   * Update options for the focus trap
   * @param {Object} newOptions - New options to merge
   */
  const updateOptions = (newOptions) => {
    Object.assign(options, newOptions);
  };

  // Auto-activate if option is set
  if (autoActivate) {
    activate();
  }

  return {
    activate,
    deactivate,
    isActive,
    updateOptions,
    getFocusableElements: () => getFocusableElements(container)
  };
}

// Export all functions
export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  fixLandmarkIssues,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssues,
  fixFakeLinkIssue,
  googleSignIn,
  fixButtonIdentifiers,
  ensureDependencyGraphAriaRole,
  newFunction,
  focusTrap
};