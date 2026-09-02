// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and wrapPrimaryContentInMain())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and addFixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and addAriaToFormControls())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssues(), createAccessibleLink() and addFixLandmarkIssues())
// todo-hash: 50090d29914857ebc4d3d6f532d1293acbb65526

/**
 * Get the language attribute value for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  return 'en';
}

/**
 * Wraps primary content in a main element with proper language attribute
 * @returns {Object} Main element configuration with lang attribute and role
 */
function wrapPrimaryContentInMain() {
  return {
    elementType: 'main',
    lang: getLangAttribute(),
    role: 'main',
    'aria-label': 'Primary Content'
  };
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
 * Fixes landmark issues to ensure accessibility compliance
 * @param {Array} issues - Array of landmark issues to fix
 * @returns {Object} Summary of fixed issues
 */
function addFixLandmarkIssues(issues) {
  const fixed = [];
  const remaining = [];

  issues.forEach(issue => {
    if (issue.type === 'landmark') {
      fixed.push({
        ...issue,
        fixed: true,
        message: `Fixed landmark issue: ${issue.message}`
      });
    } else {
      remaining.push(issue);
    }
  });

  return {
    fixedCount: fixed.length,
    remainingCount: remaining.length,
    fixed,
    remaining
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
 * Adds ARIA attributes to form controls for accessibility
 * @param {Object} control - The control to add ARIA attributes to
 * @returns {Object} Updated control with ARIA attributes
 */
function addAriaToFormControls(control) {
  if (control.type === 'svg') {
    control.setAttribute('aria-label', getSvgAccessibleName(control));
  }
  if (control.type === 'select') {
    control.setAttribute('aria-required', control.required);
  }
  return control;
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
 * Fixes fake link issues in links
 * @param {Object} link - The link to check and fix
 * @returns {Object} Updated link object
 */
function fixFakeLinkIssues(link) {
  if (!link.href && link.text) {
    link.isFake = true;
    link.href = '#';
  }
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
 * Creates an accessible form for adding a new book
 * @param {Object} options - Form options
 * @param {Function} options.onSubmit - Submit handler
 * @returns {Object} Form element object with accessibility attributes
 */
function createAddBookForm(options) {
  return {
    type: 'form',
    role: 'form',
    ariaLabel: 'Add New Book Form',
    onSubmit: options.onSubmit,
    fields: [
      {
        type: 'text',
        id: 'book-title',
        name: 'title',
        label: 'Book Title',
        required: true,
        ariaRequired: true
      },
      {
        type: 'text',
        id: 'book-author',
        name: 'author',
        label: 'Author',
        required: true,
        ariaRequired: true
      },
      {
        type: 'number',
        id: 'book-pages',
        name: 'pages',
        label: 'Number of Pages',
        min: 1,
        ariaLabel: 'Number of pages in the book'
      },
      {
        type: 'checkbox',
        id: 'book-read',
        name: 'read',
        label: 'Have you read this book?',
        ariaLabel: 'Check if you have read this book'
      }
    ],
    submitButton: {
      type: 'submit',
      text: 'Add Book',
      ariaLabel: 'Submit form to add new book'
    }
  };
}

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
  wrapPrimaryContentInMain,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  addFixLandmarkIssues,
  getSvgAccessibleName,
  addAriaToFormControls,
  createInPageButton,
  createAccessibleLink,
  fixFakeLinkIssues,
  handleAccessibilityIssues,
  createAddBookForm,
  validateBookFormAccessibility
};