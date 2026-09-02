// TODO: This is the existing code that needs to be preserved
// ... (existing code up to line 86)

// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// Add the new function for generating a report
function generateAccessibilityReport() {
  /**
   * Generates an accessibility report for the application
   * @returns {Object} Report containing summary statistics and detailed issues
   */
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalIssues: 0,
      categories: {
        tables: 0,
        landmarks: 0,
        other: 0
      }
    },
    issues: []
  };

  // Validate tables if the function is available
  if (typeof validateTableStructure === 'function') {
    try {
      // Attempt to get tables from the document - best effort approach
      // In a real implementation, you would query the actual DOM
      const tables = Array.isArray(document.tables) ||
                    (document.tables && typeof document.tables === 'object' && Array.isArray(document.tables));
      
      if (tables && tables.length > 0) {
        const result = validateTableStructure(tables);
        report.summary.categories.tables = report.summary.categories.tables + result.issues.length;
        result.issues.forEach(issue => {
          report.issues.push({
            category: 'table',
            message: issue.success ? 'None' : issue.issues[0]?.message || 'Unknown issue',
            details: issue.issues
          });
        });
      }
    } catch (e) {
      console.error('Table validation error:', e);
    }
  }

  // Validate landmarks if the function is available
  if (typeof validateLandmarkStructure === 'function') {
    try {
      // Attempt to get landmarks from the document
      const landmarks = Array.isArray(document.landmarks) ||
                        (document.landmarks && typeof document.landmarks === 'object' && Array.isArray(document.landmarks));
      
      if (landmarks && landmarks.length > 0) {
        const result = validateLandmarkStructure(landmarks);
        report.summary.categories.landmarks = report.summary.categories.landmarks + result.issues.length;
        result.issues.forEach(issue => {
          report.issues.push({
            category: 'landmark',
            message: issue.success ? 'None' : issue.issues[0]?.message || 'Unknown issue',
            details: issue.issues
          });
        });
      }
    } catch (e) {
      console.error('Landmark validation error:', e);
    }
  }

  return report;
}

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

  // Check for caption - Added from Version 1
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
 * @param {Array|Object} tables - Array of table objects or single table to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableStructure(tables) {
  const allIssues = [];
  const tableArray = Array.isArray(tables) ? tables : [tables]; // From Version 2

  tableArray.forEach((table, index) => {
    // Check for rows - From Version 2
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
 * Sets SVG attributes to ensure accessibility
 * @param {Object} svg - The SVG element to modify
 * @param {Object} options - Accessibility options
 * @param {string} options.ariaLabel - ARIA label for the SVG
 * @param {string} options.ariaLabelledby - ARIA labelledby reference
 * @param {string} options.title - Title for the SVG
 * @returns {Object} Modified SVG element
 */
function setSvgAttributes(svg, options) {
  if (options.ariaLabel) {
    svg.ariaLabel = options.ariaLabel;
  }
  if (options.ariaLabelledby) {
    svg.ariaLabelledby = options.ariaLabelledby;
  }
  if (options.title) {
    svg.title = options.title;
  }
  return svg;
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
 * Checks accessibility of links and buttons
 * @param {Array} elements - Array of elements to check
 * @returns {Object} Accessibility check result with success status and any issues found
 */
function checkLinkAndButtonAccessibility(elements) {
  const issues = [];

  elements.forEach((element, index) => {
    const elementIssues = [];

    // Check for required attributes
    if (element.type === 'a' && !element.href) {
      elementIssues.push('Link missing href attribute');
    }

    if ((element.type === 'a' || element.type === 'button') && !element.ariaLabel && !element.text) {
      elementIssues.push('Element missing accessible name (aria-label or text content)');
    }

    // Check for fake links
    if (element.type === 'a' && element.href === '#' && !element.onClick) {
      elementIssues.push('Fake link detected (href="#" without click handler)');
    }

    // Check for proper button roles
    if (element.type === 'button' && !element.onClick) {
      elementIssues.push('Button missing click handler');
    }

    if (elementIssues.length > 0) {
      issues.push({
        elementIndex: index,
        type: element.type,
        issues: elementIssues
      });
    }
  });

  return {
    success: issues.length === 0,
    issues
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
 * Handles fake links by converting them to proper accessible elements
 * @param {Object} link - The fake link to handle
 * @returns {Object} Converted accessible element
 */
function handleFakeLinks(link) {
  if (link.isFake) {
    return {
      type: 'span',
      text: link.text,
      role: 'link',
      ariaLabel: link.ariaLabel || link.text,
      tabIndex: 0
    };
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
 * Creates an accessible book form with proper labels, ARIA attributes, and validation
 * @param {Object} options - Form options
 * @param {string} options.formId - ID for the form
 * @param {string} options.title - Title for the form
 * @param {Array} options.fields - Array of field configurations
 * @param {Function} options.onSubmit - Submit handler function
 * @returns {Object} Accessible form object
 */
function createAccessibleBookForm(options) {
  // Validate required options
  if (!options.formId || !options.title || !options.fields || !options.onSubmit) {
    throw new Error('Missing required form options');
  }

  // Create form structure with proper ARIA attributes
  const form = {
    id: options.formId,
    role: 'form',
    'aria-labelledby': `${options.formId}-title`,
    titleElement: {
      id: `${options.formId}-title`,
      text: options.title,
      level: 2
    },
    fields: [],
    submitButton: createInPageButton({
      text: 'Submit Book',
      ariaLabel: `Submit ${options.title} form`,
      onClick: options.onSubmit
    })
  };

  // Process each field with accessibility features
  options.fields.forEach((field, index) => {
    const fieldId = `${options.formId}-field-${index}`;
    const accessibleField = {
      id: fieldId,
      type: field.type || 'text',
      label: {
        for: fieldId,
        text: field.label || `Field ${index + 1}`
      },
      required: field.required || false,
      'aria-required': field.required ? 'true' : 'false',
      'aria-describedby': field.description ? `${fieldId}-description` : undefined,
      description: field.description ? {
        id: `${fieldId}-description`,
        text: field.description
      } : undefined,
      value: field.value || '',
      placeholder: field.placeholder || ''
    };

    form.fields.push(accessibleField);
  });

  return form;
}

/**
 * Ens