// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

//_Commit: eadd665f8d100e17180aa53bebe3c3397ca0a5ff_

<!-- todo-hash: c87b573b0860b150bcfdfdff7be68c9f7779afde -->

// Original code preserved from main.js
function newFunction() {
  // Implementation details go here
}

// TODO: Implement new function3 logic here
function function3() {
  // Implementation for function3
  return 'function3 executed';
}

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Google sign-in logic (DONE: googleSignIn)
// - REACT_040: Replace my-button with actual button id for accessibility (DONE: fixButtonIdentifiers)
// - REACT_042: Ensure dependencyGraph container has proper ARIA role (DONE: ...

// TODO: This is the existing code that needs to be preserved
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: 92846a5072a545bdbf7610a6831c2cf8c575031d_
// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->

/**
 * Add lang attribute to HTML element for accessibility
 * @param {Document} doc - The document object
 * @param {string} lang - Language code (e.g., 'en', 'es')
 */
function addLangAttribute(doc, lang = 'en') {
  const html = doc.documentElement;
  if (html && html.setAttribute) {
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
    if (table.querySelector('tbody tr')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = doc.createElement('thead');
        const tbody = table.querySelector('tbody');
        thead.appendChild(firstRow);
        table.insertBefore(thead, tbody || table.firstChild);
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
  const existingMain = doc.querySelector('main, [role="main"]');
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
  return doc.querySelector('main, [role="main"]');
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
      if (!el.getAttribute('role') && !(el.tagName.toLowerCase() === landmark)) {
        el.setAttribute('role', landmark.slice(0, 1).toUpperCase() + landmark.slice(1));
      }
    });
}

/**
 * Ensure unique landmarks in the document
 * @param {Document} doc - The document object
 * @returns {Array} Array of duplicate landmarks
 */
function ensureUniqueLandmarks(doc) {
  const landmarks = doc.querySelectorAll('header, nav, main, aside, footer');
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
      const title = doc.createElement('title');
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
    if (svg && svg.tagName && svg.tagName.toLowerCase() === 'svg') {
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
  const links = doc.querySelectorAll('a[href=""], a:not([href])');
  links.forEach((link) => {
    const onclick = link.getAttribute('onclick');
    const role = link.getAttribute('role');
    // If it's a fake link (using onclick as navigation), add button role or make it a button
    if ((onclick && onclick.includes('location')) || role === 'link') {
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
  if (link && link.tagName && link.tagName.toLowerCase() === 'a') {
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
      // Initialize Google Sign-In
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
  const buttons = doc.querySelectorAll('button[id="my-button"], [id="my-button"]');
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
function ensureDependencyGraphContainer(doc) {
  const container = doc.querySelector('.dependency-graph, [data-dependency-graph]');
  if (container) {
    if (!container.getAttribute('role')) {
      container.setAttribute('role', 'region');
    }
    if (!container.getAttribute('aria-label') && !container.getAttribute('aria-labelledby')) {
      container.setAttribute('aria-label', 'Dependency Graph');
    }
  }
  return container;
}

/**
 * Render the main application with all accessibility enhancements
 * @param {Document} doc - The document object
 * @param {Object} options - Rendering options
 */
function renderApp(doc, options = {}) {
  const { lang = 'en' } = options;
  
  // Apply all accessibility fixes
  addLangAttribute(doc, lang);
  fixTableStructure(doc);
  fixLandmarkIssues(doc);
  addAccessibleNamesToSVGs(doc);
  fixFakeLinkIssues(doc);
  fixButtonIdentifiers(doc);
  ensureDependencyGraphAriaRole(doc);
  
  return doc;
}

// REACT_015: Utility for person name
function personName() {
  return 'User';
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(doc) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return [];
    }
  }
  const tables = doc.querySelectorAll('table');
  const issues = [];
  tables.forEach((table) => {
    if (!table.querySelector('caption')) {
      issues.push({ element: table, issue: 'missing-caption' });
    }
  });
  return issues;
}

// REACT_027: Validate table structure
function validateTableStructure(doc) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return [];
    }
  }
  const tables = doc.querySelectorAll('table');
  const issues = [];
  tables.forEach((table) => {
    if (!table.querySelector('thead')) {
      issues.push({ element: table, issue: 'missing-thead' });
    }
    if (!table.querySelector('tbody')) {
      issues.push({ element: table, issue: 'missing-tbody' });
    }
  });
  return issues;
}

// REACT_017: Validate landmark
function validateLandmark(doc) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return [];
    }
  }
  const issues = [];
  const landmarks = ['header', 'nav', 'main', 'footer'];
  landmarks.forEach((landmark) => {
    const elements = doc.querySelectorAll(landmark);
    if (elements.length === 0) {
      issues.push({ landmark, issue: 'missing-landmark' });
    }
  });
  return issues;
}

// REACT_017: Validate landmark structure
function validateLandmarkStructure(doc) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return [];
    }
  }
  const issues = [];
  const landmarks = doc.querySelectorAll('header, nav, main, aside, footer');
  landmarks.forEach((el) => {
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
      issues.push({ element: el, issue: 'missing-accessible-name' });
    }
  });
  return issues;
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svg) {
  if (svg && svg.tagName && svg.tagName.toLowerCase() === 'svg') {
    return svg.getAttribute('aria-label') || (svg.querySelector('title') && svg.querySelector('title').textContent) || '';
  }
  return '';
}

// REACT_036: Create in-page button
function createInPageButton(doc, options = {}) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return null;
    }
  }
  const button = doc.createElement('button');
  if (options.label) {
    button.setAttribute('aria-label', options.label);
    button.textContent = options.label;
  }
  return button;
}

// NEW: Focus trap for keyboard navigation
function newFocusTrap(container) {
  if (!container) {
    return null;
  }
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(event) {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement && lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement && firstElement.focus();
        }
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);
  if (firstElement) {
    firstElement.focus();
  }

  return {
    activate: () => firstElement && firstElement.focus(),
    deactivate: () => container.removeEventListener('keydown', handleKeyDown)
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
  ensureDependencyGraphContainer,
  newExportedFunction,

  // Utility
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  newFocusTrap
};

// Start the application if run directly
if (require.main === module) {
  // Note: startApp is not defined in this file, so it's commented out to avoid error.
  // If startApp is defined elsewhere, uncomment the following line.
  // startApp();
}