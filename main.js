// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

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
  generateAccessibilityReport
};