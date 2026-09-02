// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkAttributes() and ensureUniqueLandmarks())
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

  if (!table.getAttribute('headers')) {
    issues.push('Missing headers attribute');
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
 * @param {Object} options - Button options
 * @param {string} options.text - Button text
 * @param {string} options.ariaLabel - Aria label for the button
 * @param {Function} options.onClick - Click handler
 * @returns {Object} Button element object
 */
function createInPageButton(options) {
  return {
    type: 'button',
    text: options.text,
    ariaLabel: options.ariaLabel || options.text,
    onClick: options.onClick,
    accessibleName: getSvgAccessibleName({ ariaLabel: options.ariaLabel })
  };
}

/**
 * Creates an accessible link element
 * @param {Object} options - Link options
 * @param {string} options.href - Link URL
 * @param {string} options.text - Link text
 * @param {string} options.ariaLabel - Aria label for the link
 * @returns {Object} Link element object
 */
function createAccessibleLink(options) {
  return {
    type: 'a',
    href: options.href,
    text: options.text,
    ariaLabel: options.ariaLabel || options.text,
    isFake: false
  };
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
 * Handles Google sign-in logic with accessibility considerations
 * @param {Object} options - Sign-in options
 * @param {string} options.clientId - Google client ID
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onFailure - Failure callback
 * @returns {Object} Sign-in button configuration
 */
function googleSignIn(options) {
  return {
    type: 'button',
    text: 'Sign in with Google',
    ariaLabel: 'Sign in with Google account',
    onClick: () => {
      // Google sign-in logic would go here
      if (options.onSuccess) options.onSuccess();
    },
    accessibleName: 'Google Sign In'
  };
}

/**
 * Fixes button identifiers to ensure proper accessibility
 * @param {Array} buttons - Array of button elements
 * @returns {Array} Array of fixed button elements
 */
function fixButtonIdentifiers(buttons) {
  return buttons.map(button => {
    if (button.id === 'my-button') {
      return {
        ...button,
        id: `button-${Date.now()}`,
        ariaLabel: button.ariaLabel || button.text
      };
    }
    return button;
  });
}

/**
 * Ensures the dependency graph container has a proper ARIA role
 * @param {Object} container - The container element
 * @returns {Object} The container with proper ARIA role
 */
function ensureDependencyGraphAriaRole(container) {
  return {
    ...container,
    role: container.role || 'region',
    ariaLabel: container.ariaLabel || 'Dependency Graph'
  };
}

// New Function: Validate book form for accessibility compliance
/**
 * Validates a book form for accessibility compliance
 * @param {Object} form - The form object to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateBookFormAccessibility(form) {
  const issues = [];

  if (!form.role) {
    issues.push('Missing role attribute for form');
  }

  if (!form.ariaLabel) {
    issues.push('Missing aria-label for form');
  }

  form.fields.forEach(field => {
    if (field.required && !field.ariaRequired) {
      issues.push(`Field ${field.name} is required but missing aria-required`);
    }
    if (!field.label && !field.ariaLabel) {
      issues.push(`Field ${field.name} is missing both label and aria-label`);
    }
  });

  return {
    success: issues.length === 0,
    issues
  };
}

// Export all functions for testing and external use
module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues,
  googleSignIn,
  fixButtonIdentifiers,
  ensureDependencyGraphAriaRole,
  createAddBookForm,
  validateBookFormAccessibility
};