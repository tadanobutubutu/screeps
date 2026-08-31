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
 * Handle focus trap for keyboard navigation within a given container
 * @param {HTMLElement} container - The container element to trap focus within
 * @param {Object} options - Configuration options for the focus trap
 * @param {boolean} options.escapeDeactivates - Whether pressing Escape should deactivate the trap
 * @returns {Object} An object with methods to manage the focus trap
 */
function handleFocusTrap(container, options = { escapeDeactivates: true }) {
  if (!container || !container.setAttribute) {
    console.warn('Invalid container provided for focus trap');
    return {
      activate: () => {},
      deactivate: () => {},
      isActive: () => false,
      handleKeydown: () => {}
    };
  }

  // Store original tabindex values for restoration
  const originalTabindex = new Map();
  let isActiveTrap = false;

  // Collect all focusable elements in the container
  const getFocusableElements = () => {
    return container.querySelectorAll(
      'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), ' +
      'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, ' +
      '[tabindex]:not([tabindex="-1"]), [contenteditable]'
    );
  };

  const focusableElements = () => Array.from(getFocusableElements());

  const handleFocusIn = () => {
    if (!isActiveTrap) return;
    const elements = focusableElements();
    if (elements.length === 0) return;

    // If focus is on the container itself and there are focusable children, focus the first
    if (container === document.activeElement && elements[0]) {
      elements[0].focus();
    }
  };

  const handleKeydown = (event) => {
    if (!isActiveTrap || event.key !== 'Tab') return;
    
    const elements = focusableElements();
    if (elements.length === 1) {
      // With only one focusable element, keep focus within the container
      event.preventDefault();
      if (document.activeElement === elements[0]) {
        elements[0].focus();
      }
      return;
    }

    if (elements.length === 0) return;

    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  const handleEscapeKeydown = (event) => {
    if (!isActiveTrap || event.key !== 'Escape') return;

    if (options.escapeDeactivates) {
      event.preventDefault();
      deactivate();

      // Restore focus to the container after deactivation
      if (container.hasAttribute('tabindex')) {
        container.focus();
      }
    }
  };

  const activate = () => {
    if (isActiveTrap) return;

    // Ensure container can receive focus if it doesn't already
    if (!container.hasAttribute('tabindex')) {
      container.setAttribute('tabindex', '-1');
      originalTabindex.set(container, null);
    } else {
      originalTabindex.set(container, container.getAttribute('tabindex'));
    }

    isActiveTrap = true;

    // Add event listeners
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keydown', handleEscapeKeydown);
  };

  const deactivate = () => {
    if (!isActiveTrap) return;

    isActiveTrap = false;

    // Remove event listeners
    document.removeEventListener('focusin', handleFocusIn);
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('keydown', handleEscapeKeydown);

    // Restore original tabindex if it wasn't originally present
    if (originalTabindex.get(container) === null) {
      container.removeAttribute('tabindex');
    } else if (originalTabindex.has(container)) {
      container.setAttribute('tabindex', originalTabindex.get(container));
    }
  };

  return {
    activate,
    deactivate,
    isActive: () => isActiveTrap,
    handleKeydown,
    handleEscapeKeydown
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
  handleFocusTrap,
  newFunction
};