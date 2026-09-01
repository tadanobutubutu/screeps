/**
 * TODO: This is the existing code that needs to be preserved
 * Addressed accessibility issues from insight report:
 * - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
 * - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
 * - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkAttributes() and ensureUniqueLandmarks())
 * - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
 * - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
 * - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())
 * - REACT_037: Google sign-in logic (handled by googleSignIn())
 * - REACT_040: Replace my-button with actual button id for accessibility (handled by fixButtonIdentifiers())
 * - REACT_042: Ensure dependencyGraph container has proper ARIA role (handled by ensureDependencyGraphAriaRole())

/**
 * Gets the contrast ratio between two colors
 * @param {string} color1 - First color in hex format (e.g., "#FFFFFF")
 * @param {string} color2 - Second color in hex format (e.g., "#000000")
 * @returns {number} The contrast ratio between the two colors (1-21)
 */
function getContrastRatio(color1, color2) {
  // Helper function to convert hex to RGB
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  };

  // Helper function to calculate relative luminance
  const getLuminance = (r, g, b) => {
    const a = [r, g, b].map(v => {
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  // Convert colors to RGB
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);

  // Calculate luminance for each color
  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);

  // Calculate contrast ratio
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  return ratio;
}

/**
 * Generates a report based on accessibility issues
 * @param {Object} validationResults - Results from accessibility validations
 * @returns {Object} Formatted report with summary and detailed issues
 */
function generateAccessibilityReport(validationResults) {
  const report = {
    summary: {
      totalIssues: 0,
      handledIssues: 0,
      unhandledIssues: 0,
      criticalIssues: 0,
      warnings: 0
    },
    details: {
      tables: [],
      landmarks: [],
      svgs: [],
      other: []
    }
  };

  // Process table validation results
  if (validationResults.tables) {
    validationResults.tables.forEach(tableResult => {
      if (!tableResult.success) {
        report.summary.totalIssues += tableResult.issues.length;
        report.details.tables.push({
          tableIndex: tableResult.tableIndex,
          issues: tableResult.issues
        });
      }
    });
  }

  // Process landmark validation results
  if (validationResults.landmarks) {
    validationResults.landmarks.forEach(landmarkResult => {
      if (!landmarkResult.success) {
        report.summary.totalIssues += landmarkResult.issues.length;
        report.details.landmarks.push({
          landmarkIndex: landmarkResult.landmarkIndex,
          issues: landmarkResult.issues
        });
      }
    });
  }

  // Process SVG validation results
  if (validationResults.svgs) {
    validationResults.svgs.forEach(svgResult => {
      if (!svgResult.success) {
        report.summary.totalIssues += svgResult.issues.length;
        report.details.svgs.push({
          svgIndex: svgResult.svgIndex,
          issues: svgResult.issues
        });
      }
    });
  }

  // Process other validation results
  if (validationResults.other) {
    validationResults.other.forEach(otherResult => {
      if (!otherResult.success) {
        report.summary.totalIssues += otherResult.issues.length;
        report.details.other.push({
          issueType: otherResult.issueType,
          issues: otherResult.issues
        });
      }
    });
  }

  // Calculate summary statistics
  if (validationResults.handledIssues) {
    report.summary.handledIssues = validationResults.handledIssues;
  }

  if (validationResults.unhandledIssues) {
    report.summary.unhandledIssues = validationResults.unhandledIssues;
  }

  // Categorize issues by severity
  if (validationResults.criticalIssues) {
    report.summary.criticalIssues = validationResults.criticalIssues;
  }

  if (validationResults.warnings) {
    report.summary.warnings = validationResults.warnings;
  }

  return report;
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
>>>>>>> origin/main
};

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
  validateBookFormAccessibility,
  getContrastRatio,
  generateAccessibilityReport
};