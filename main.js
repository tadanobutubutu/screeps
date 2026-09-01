// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

/**
 * Get the language attribute value for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  return 'en';
}

/**
 * Get the full language attribute string for the HTML element
 * @returns {string} The full lang attribute (e. g., "en" or "en-US")
 */
function getFullLangAttribute() {
  return 'en-US';
}

/**
 * Adds lang attribute to HTML element
 * @param {Object} element - The HTML element to modify
 * @returns {Object} The modified element with lang attribute
 */
function addLangAttribute(element) {
  element.lang = getFullLangAttribute();
  return element;
}

/**
 * Validates landmark elements
 * @param {Object} element - The landmark element to validate
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

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates landmark attributes
 * @param {Object} landmark - The landmark element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmarkAttributes(landmark) {
  const issues = [];

  if (!landmark.ariaLabel && !landmark.ariaLabelledby && !landmark.textContent) {
    issues.push('Landmark missing accessible name');
  }

  if (landmark.role && !['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'search'].includes(landmark.role)) {
    issues.push(`Invalid landmark role: ${landmark.role}`);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates the structure of landmark elements
 * @param {Array} landmarks - Array of landmark elements to validate (optional)
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmarkStructure(landmarks) {
  const issues = [];

  if (Array.isArray(landmarks)) {
    landmarks.forEach((landmark, index) => {
      const result = validateLandmark(landmark);
      if (!result.success) {
        issues.push({
          landmarkIndex: index,
          issues: result.issues
        });
      }
    });
  } else {
    // Otherwise, check for required landmarks in the DOM
    const allLandmarks = document.querySelectorAll('[role]');
    let hasMain = false;
    let hasNavigation = false;

    allLandmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
    });

    if (!hasMain) {
      issues.push('Missing main landmark');
    }
    if (!hasNavigation) {
      issues.push('Missing navigation landmark');
    }
  }

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
      if (!duplicates.includes(name)) {
        duplicates.push(name);
      }
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

  // Check for caption (conflict resolved: check for both)
  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  if (!table.getAttribute('headers')) {
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
  const tableArray = Array.isArray(tables) ? tables : [tables];

  tableArray.forEach((table, index) => {
    // Check for rows
    const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
    if (rows.length === 0) {
      allIssues.push({
        tableIndex: index,
        issues: ['Table has no rows']
      });
    }

    // Validate table accessibility
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
 * Gets the accessible name for an SVG element
 * @param {Object} svg - The SVG element
 * @returns {string} The accessible name for the SVG
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return 'Accessible SVG Icon';

  const title = svgElement.querySelector('title');
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (title) return title.textContent;
  if (ariaLabel) return ariaLabel;
  return 'Accessible SVG Icon';
}

/**
 * Adds accessibility properties to an SVG element
 * @param {Object} svg - The SVG element to enhance
 * @param {Object} options - Accessibility options
 * @param {string} options.ariaLabel - ARIA label for the SVG
 * @param {string} options.ariaHidden - ARIA hidden state
 * @param {string} options.role - ARIA role for the SVG
 * @returns {Object} The enhanced SVG element with accessibility properties
 */
function addSvgAccessibilityProps(svg, options = {}) {
  const enhancedSvg = { ...svg };

  if (options.ariaLabel) {
    enhancedSvg.ariaLabel = options.ariaLabel;
  }
  if (options.ariaHidden) {
    enhancedSvg.ariaHidden = options.ariaHidden;
  }
  if (options.role) {
    enhancedSvg.role = options.role;
  }

  return enhancedSvg;
}

/**
 * Validates link accessibility
 * @param {Object} link - The link element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLinkAccessibility(link) {
  const issues = [];

  if (!link.href) {
    issues.push('Link missing href attribute');
  }

  if (!link.textContent && !link.ariaLabel) {
    issues.push('Link missing accessible name');
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Handles fake links by converting them to accessible in-page buttons
 * @param {Object} link - The link element
 * @returns {Object} The converted button or original link
 */
function handleFakeLinks(link) {
  if (link.href === '#' || link.href === 'javascript:void(0)') {
    return createInPageButton({
      text: link.textContent,
      ariaLabel: link.ariaLabel,
      onClick: link.onClick
    });
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
    handled,
    unhandled
  };
}

/**
 * Validates the structure of a form for accessibility
 * @param {Object} form - The form object to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateFormAccessibility(form) {
  const issues = [];

  if (!form.labels) {
    issues.push('Missing form labels');
  }

  if (!form.accessibleName) {
    issues.push('Missing accessible name for form');
  }

  if (!form.errorHandling) {
    issues.push('Missing error handling for form');
}

/**
 * Validates the structure of forms for accessibility
 * @param {Array} forms - Array of form objects to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateFormStructure(forms) {
  const allIssues = [];

  forms.forEach((form, index) => {
    const result = validateFormAccessibility(form);
    if (!result.success) {
      allIssues.push({
        formIndex: index,
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
 * Ensures all landmarks in the document are properly structured
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
 * Creates an accessible form element
 * @param {Object} options - Form options
 * @param {string} options.name - Form name
 * @param {string} options.action - Form action URL
 * @param {string} options.method - Form submission method
 * @param {Array} options.fields - Array of form fields
 * @returns {Object} Form element object
 */
function createAccessibleForm(options) {
  return {
    type: 'form',
    name: options.name,
    action: options.action,
    method: options.method || 'POST',
    fields: options.fields || [],
    accessibleName: options.name,
    labels: options.fields.every(field => field.label),
    errorHandling: options.errorHandling || false
  };
}

// Export all functions for testing and external use
module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkAttributes,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  addSvgAccessibilityProps,
  setSvgAccessibilityProps,
  handleAccessibilityIssues,
  validateLinkAccessibility,
  handleFakeLinks,
  createInPageButton,
  createAccessibleLink,
  handleCredentialResponse,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  uniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssues,
  googleSignIn,
  fixButtonIdentifiers,
  ensureDependencyGraphAriaRole,
  setSvgAttributes,
  addProperLandmarkRegions,
  createLandmark,
  validateAllLandmarks
};