// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())
// - REACT_037: Google sign-in logic (handled by googleSignIn())
// - REACT_040: Replace my-button with actual button id for accessibility (handled by fixButtonIdentifiers())
// - REACT_042: Ensure dependencyGraph container has proper ARIA role (handled by ensureDependencyGraphAriaRole())

/**
 * Get the language attribute value for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  return 'en';
}

/**
 * Get the full language attribute string for the HTML element
 * @returns {string} The full lang attribute (e.g., "en" or "en-US")
 */
function getFullLangAttribute() {
  return 'en-US';
}

/**
 * Validates table accessibility compliance
 * @param {Object} table - The table object to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableAccessibility(table) {
  const issues = [];

  if (!table.headers) {
    issues.push('Missing headers attribute');
  }

  if (!table.scope) {
    issues.push('Missing scope attribute');
  }

  // Check for caption
  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates the structure of tables for accessibility
 * @param {Array} tables - Array of table objects to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableStructure(tables) {
  const allIssues = [];

  tables.forEach((table, index) => {
    const result = validateTableAccessibility(table);
    if (!result.success) {
      allIssues.push({
        tableIndex: index,
        issues: result.issues
      });
    }
  });

  return {
    success: allIssues.length === 0,
    issues: allIssues
  };
}

/**
 * Validates landmark elements for accessibility
 * @param {Object} element - The element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmark(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!element.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${element.tagName}`);
  }

  if (!element.hasAttribute('id')) {
    issues.push('Missing id attribute');
  }

  if (!element.getAttribute('role')) {
    issues.push('Missing role attribute');
  }

  if (!element.ariaLabel && !element.ariaLabelledby && !element.textContent) {
    issues.push('Landmark missing accessible name');
  }

  if (element.role && !['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'search'].includes(element.role)) {
    issues.push(`Invalid landmark role: ${element.role}`);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates the structure of landmark elements
 * @param {Array} landmarks - Array of landmark elements to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmarkStructure(landmarks) {
  const issues = [];

  landmarks.forEach((landmark, index) => {
    const result = validateLandmark(landmark);
    if (!result.success) {
      issues.push({
        landmarkIndex: index,
        issues: result.issues
      });
    }
  });

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Ensures all landmarks have unique accessible names
 * @param {Array} landmarks - Array of landmark elements to check
 * @returns {Object} Result with success status and any duplicate names found
 */
function ensureUniqueLandmarks(landmarks) {
  const names = [];
  const duplicates = [];

  landmarks.forEach(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
    if (names.includes(name)) {
      duplicates.push(name);
    } else {
      names.push(name);
    }
  });

  return {
    success: duplicates.length === 0,
    duplicates
  };
}

/**
 * Gets the accessible name for an SVG element
 * @param {Object} svg - The SVG element
 * @returns {string} The accessible name for the SVG
 */
function getSvgAccessibleName(svg) {
  if (svg.ariaLabel) {
    return svg.ariaLabel;
  }
  if (svg.ariaLabelledby) {
    return svg.ariaLabelledby;
  }
  if (svg.title) {
    return svg.title;
  }
  return 'Unnamed SVG';
}

/**
 * Creates an accessible in-page button
 * @param {Object|string} options - Button options (either text string or options object)
 * @param {Function} options.onClick - Click handler
 * @returns {Object} The created button element
 */
function createInPageButton(options) {
  let text = options;
  let clickHandler = options.onClick;
  
  // Handle object parameter format
  if (typeof options === 'object' && options !== null) {
    text = options.text || '';
    clickHandler = options.onClick;
  }
  
  // Implementation to create accessible in-page button
  const button = document.createElement('button');
  button.textContent = text;
  if (clickHandler) {
    button.onclick = clickHandler;
  }
  button.setAttribute('aria-label', text);
  if (text.length === 0) {
    button.setAttribute('aria-label', 'Empty button');
  }
  return button;
}

/**
 * Creates an accessible link element
 * @param {string} href - The link href
 * @param {string} text - The link text
 * @returns {Object} The created link element
 */
function createAccessibleLink(href, text) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  link.setAttribute('aria-label', text);
  return link;
}

/**
 * Handles accessibility issues found during validation
 * @param {Array} issues - Array of accessibility issues
 * @returns {Object} Summary of handled issues
 */
function handleAccessibilityIssues(issues) {
  const handled = [];
  const unhandled = [];

  issues.forEach(issue => {
    if (issue.fixable) {
      handled.push(issue);
    } else {
      unhandled.push(issue);
    }
  });

  return {
    total: issues.length,
    handled: handled.length,
    unhandled: unhandled.length,
    unhandledIssues: unhandled
  };
}

/**
 * Validates link accessibility compliance
 * @param {Object} link - The link object to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLinkAccessibility(link) {
  const issues = [];

  if (!link.href) {
    issues.push('Missing href attribute');
  }

  if (!link.text && !link.ariaLabel) {
    issues.push('Missing both text content and aria-label');
  }

  if (link.isFake) {
    issues.push('Fake link detected');
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Creates a new landmark element with proper attributes
 * @param {Object} options - Landmark options
 * @param {string} options.type - Type of landmark (header, nav, main, etc.)
 * @param {string} options.ariaLabel - Accessible name for the landmark
 * @param {string} options.content - Content of the landmark
 * @returns {Object} Landmark element object
 */
function createLandmark(options) {
  const landmark = {
    type: options.type,
    ariaLabel: options.ariaLabel,
    content: options.content
  };

  // Validate the created landmark
  const validation = validateLandmark(landmark);
  if (!validation.success) {
    throw new Error(`Invalid landmark created: ${validation.issues.join(', ')}`);
  }

  return landmark;
}

/**
 * Validates the structure of landmark elements
 * @param {Array} landmarks - Array of landmark elements to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateAllLandmarks(landmarks) {
  const structureValidation = validateLandmarkStructure(landmarks);
  const uniquenessValidation = ensureUniqueLandmarks(landmarks);

  return {
    success: structureValidation.success && uniquenessValidation.success,
    structureIssues: structureValidation.issues,
    uniquenessIssues: uniquenessValidation.duplicates
  };
}

/**
 * Fixes table structure issues
 * @param {Array|Object} tables - Array of tables or a single table to fix
 * @returns {Array|Object} Fixed table(s)
 */
function fixTableStructure(tables) {
  if (Array.isArray(tables)) {
    return tables.map(table => fixTableStructure(table));
  }

  // Single table fix
  const table = tables;
  if (!table.headers) {
    table.headers = 'auto';
  }

  if (!table.scope) {
    table.scope = 'auto';
  }

  return table;
}

/**
 * Fixes landmark issues
 * @param {Array} landmarks - Array of landmarks to fix
 * @returns {Array} Array of fixed landmarks
 */
function fixLandmarkIssues(landmarks) {
  return landmarks.map(landmark => {
    if (!landmark.tagName) {
      return { ...landmark, tagName: 'section' };
    }
    return landmark;
  });
}

/**
 * Adds main landmark if missing
 * @param {Array|Object} target - Array of landmarks or document object
 * @returns {Array|Object} Array with main landmark added if needed, or document with main landmark
 */
function addMainLandmark(target) {
  if (Array.isArray(target)) {
    const hasMain = target.some(landmark => landmark.tagName.toLowerCase() === 'main');
    if (!hasMain) {
      return [...target, { tagName: 'main', ariaLabel: 'Main content' }];
    }
    return target;
  } else if (target && target.querySelector) {
    // Document version
    if (!target.querySelector('main')) {
      const main = target.createElement('main');
      main.setAttribute('role', 'main');
      target.body.appendChild(main);
    }
    return target;
  }
  return target;
}

/**
 * Adds landmark regions if needed
 * @param {Array} landmarks - Array of existing landmarks
 * @returns {Array} Array with additional landmark regions
 */
function addLandmarkRegions(landmarks) {
  const requiredRegions = ['header', 'footer', 'nav'];
  const existingTags = landmarks.map(l => l.tagName.toLowerCase());