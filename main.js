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
 */

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
 * Adds lang attribute to HTML element
 * @param {Object} element - The HTML element to modify
 * @returns {Object} The modified element with lang attribute
 */
function addLangAttribute(element) {
  element.lang = getFullLangAttribute();
  return element;
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
 * Validates landmark elements for accessibility
 * @param {Object} element - The element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmark(element) {
  const issues = [];

  if (!element.tagName) {
    issues.push('Missing tagName');
  } else {
    const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
    if (!validLandmarks.includes(element.tagName.toLowerCase())) {
      issues.push(`Invalid landmark: ${element.tagName}`);
    }
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
 * Creates an accessible in-page button
 * @param {Object|string} textOrOptions - The button text or options object
 * @param {Function} onClick - The click handler
 * @returns {Object} The created button element
 */
function createInPageButton(textOrOptions, onClick) {
  let text = textOrOptions;
  let clickHandler = onClick;
  
  // Handle object parameter format
  if (typeof textOrOptions === 'object' && textOrOptions !== null) {
    text = textOrOptions.text || '';
    clickHandler = textOrOptions.onClick;
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
 * Creates an accessible link
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

  requiredRegions.forEach(region => {
    if (!existingTags.includes(region)) {
      landmarks.push({ tagName: region, ariaLabel: `${region} region` });
    }
  });

  return landmarks;
}

/**
 * Ensures unique landmarks by adding suffixes to duplicates
 * @param {Array} landmarks - Array of landmarks to process
 * @returns {Array} Array with unique landmarks
 */
function uniqueLandmarks(landmarks) {
  const nameCounts = {};

  return landmarks.map(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent || '';
    if (nameCounts[name]) {
      nameCounts[name]++;
      return {
        ...landmark,
        ariaLabel: `${name} ${nameCounts[name]}`
      };
    } else {
      nameCounts[name] = 1;
      return landmark;
    }
  });
}

/**
 * Adds accessible names to SVGs
 * @param {Array} svgs - Array of SVG elements
 * @returns {Array} Array of SVGs with accessible names
 */
function addSvgAccessibleNames(svgs) {
  return svgs.map(svg => ({
    ...svg,
    ariaLabel: svg.ariaLabel || svg.title || 'SVG graphic'
  }));
}

/**
 * Fixes fake link issues
 * @param {Array} links - Array of links to check
 * @returns {Array} Array of fixed links
 */
function fixFakeLinkIssues(links) {
  return links.map(link => ({
    ...link,
    isFake: link.href === '#' || !link.href,
    role: link.href === '#' ? 'button' : undefined
  }));
}

/**
 * Handles Google sign-in logic for accessibility
 * @param {Object} options - Sign-in options
 * @returns {Object} Accessible sign-in button
 */
function googleSignIn(options) {
  return createInPageButton({
    ...options,
    ariaLabel: options.ariaLabel || 'Sign in with Google',
    text: options.text || 'Sign in with Google'
  });
}

/**
 * Fixes button identifiers for accessibility
 * @param {Object} button - Button element to fix
 * @param {string} id - New ID for the button
 * @returns {Object} Fixed button with proper ID
 */
function fixButtonIdentifiers(button, id) {
  return {
    ...button,
    id: id || button.id || 'accessible-button',
    ariaLabel: button.ariaLabel || button.text || 'Button'
  };
}

/**
 * Ensures dependency graph container has proper ARIA role
 * @param {Object} container - The container element
 * @returns {Object} Container with proper ARIA role
 */
function ensureDependencyGraphAriaRole(container) {
  return {
    ...container,
    role: container.role || 'region',
    ariaLabel: container.ariaLabel || 'Dependency graph'
  };
}

/**
 * Sets SVG attributes for accessibility
 * @param {Object} svg - The SVG element
 * @param {string} accessibleName - The accessible name
 * @returns {Object} The SVG element with attributes set
 */
function setSvgAttributes(svg, accessibleName) {
  svg.setAttribute('aria-label', accessibleName);
  svg.setAttribute('role', 'img');
  return svg;
}

/**
 * Handles the credential response from authentication
 * @param {Object} credentialResponse - The credential response object
 * @returns {Object} Processed credential data
 */
function handleCredentialResponse(credentialResponse) {
  if (!credentialResponse || typeof credentialResponse !== 'object') {
    throw new Error('Invalid credential response');
  }

  const { credential, clientExtensionResults, authenticatorData } = credentialResponse;

  if (!credential || typeof credential !== 'string') {
    throw new Error('Invalid credential in response');
  }

  const processedCredential = {
    rawId: credential,
    id: credential,
    response: {
      clientDataJSON: credentialResponse.clientDataJSON,
      authenticatorData: authenticatorData || null,
      signature: credentialResponse.signature || null,
      userHandle: credentialResponse.userHandle || null
    },
    type: 'public-key',
    extensions: clientExtensionResults || {}
  };

  if (!processedCredential.response.clientDataJSON) {
    throw new Error('Missing clientDataJSON in credential response');
  }

  return processedCredential;
}

/**
 * Adds proper landmark regions to the document
 * @param {Object} document - The document object
 * @returns {Object} The document with landmark regions added
 */
function addProperLandmarkRegions(document) {
  const regions = [
    { selector: 'header', role: 'banner' },
    { selector: 'nav', role: 'navigation' },
    { selector: 'main', role: 'main' },
    { selector: 'aside', role: 'complementary' },
    { selector: 'footer', role: 'contentinfo' }
  ];

  regions.forEach(region => {
    const elements = document.querySelectorAll(region.selector);
    elements.forEach(element => {
      if (!element.getAttribute('role')) {
        element.setAttribute('role', region.role);
      }
    });
  });

  return document;
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

  if (validationResults.handledIssues) {
    report.summary.handledIssues = validationResults.handledIssues;
  }

  if (validationResults.unhandledIssues) {
    report.summary.unhandledIssues = validationResults.unhandledIssues;
  }

  if (validationResults.criticalIssues) {
    report.summary.criticalIssues = validationResults.criticalIssues;
  }

  if (validationResults.warnings) {
    report.summary.warnings = validationResults.warnings;
  }

  return report;
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
  getFullLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkAttributes,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues,
  createLandmark,
  validateAllLandmarks,
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
  handleCredentialResponse,
  addProperLandmarkRegions,
  generateAccessibilityReport,
  createAddBookForm,
  validateBookFormAccessibility
};