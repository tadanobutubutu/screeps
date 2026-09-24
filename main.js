const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

/**
 * Get the language attribute value for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  return 'en';
}

function getFullLangAttribute() {
  return 'en-US';
}

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

  if (!table) {
    issues.push('Table is null or undefined');
  }

  if (!table.querySelector) {
    issues.push('Table structure issue: Missing querySelector method');
  }

  if (!table.querySelector('caption')) {
    issues.push('Table structure issue: Missing caption element');
  }

  if (!table.querySelector('thead')) {
    issues.push('Table structure issue: Missing thead element');
  }

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

    tableArray.forEach((table, index) => {
      // Check for rows
      const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
      if (rows.length === 0) {
        allIssues.push({
          tableIndex: index,
          issues: ['Table has no rows']
        });
      }

/**
 * Validates landmark attributes
 * @param {Object} landmark - The landmark element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmarkAttributes(landmark) {
  const issues = [];

  if (!landmark.ariaLabel && !landmark.ariaLabelledby && !landmark.textContent) {
    issues.push('Landmark structure issue: Landmark missing accessible name');
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

    const attrResult = validateLandmarkAttributes(landmark);
    if (!attrResult.success) {
      issues.push({
        landmarkIndex: index,
        issues: attrResult.issues
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
function validateLinkAccessibility(link) {
  const issues = [];

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
 * @param {Object} svgElement - The SVG element
 * @returns {string} The accessible name for the SVG
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return 'Accessible SVG Icon';

  const title = svgElement.querySelector('title') || svgElement.querySelector('desc');
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (title) return title.textContent || title.innerHTML;
  if (ariaLabel) return ariaLabel;
  return 'Accessible SVG Icon';
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
      ]
    };
  }

  /**
   * Validates book form accessibility
   * @param {Object} form - The form element to validate
   * @returns {Object} Validation result with success status and any issues found
   */
  function validateBookFormAccessibility(form) {
    const issues = [];

    if (!form.ariaLabel) {
      issues.push('Form missing aria-label');
    }

    if (!form.fields || !Array.isArray(form.fields) || form.fields.length === 0) {
      issues.push('Form has no fields');
    }

    form.fields.forEach((field, index) => {
      if (!field.id) {
        issues.push(`Field ${index} missing id attribute`);
      }
      if (!field.label) {
        issues.push(`Field ${index} missing label`);
      }
    });

    return {
      success: issues.length === 0,
      issues
    };
  }

  /**
   * Fixes table structure by adding missing attributes
   * @param {Object} table - The table element to fix
   * @returns {Object} The fixed table element
   */
  function fixTableStructure(table) {
    if (!table.headers) {
      table.headers = 'auto';
    }

    if (!table.scope) {
      table.scope = 'auto';
    }

    return table;
  }

  /**
   * Adds main landmark if missing
   * @param {Document} document - The document object
   * @returns {Document} The modified document
   */
  function addMainLandmark(document) {
    if (!document.querySelector('main')) {
      const main = document.createElement('main');
      main.setAttribute('role', 'main');
      document.body.appendChild(main);
    }
    return document;
  }

  /**
   * Sets SVG accessibility attributes
   * @param {Object} svg - The SVG element
   * @param {string} accessibleName - The accessible name for the SVG
   * @returns {Object} The modified SVG element
   */
  function setSvgAttributes(svg, accessibleName) {
    svg.setAttribute('aria-label', accessibleName);
    svg.setAttribute('role', 'img');
    return svg;
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
   * Handles fake links by converting them to buttons
   * @param {Object} link - The link element to check
   * @returns {Object} Either a button element or the original link
   */
  function handleFakeLinks(link) {
    if (link.href === '#' || link.href === 'javascript:void(0)') {
      return createInPageButton(link.textContent, link.onClick);
    }
    return link;
  }

  /**
   * Adds proper landmark regions to document
   * @param {Document} document - The document object
   * @returns {Document} The modified document
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

  module.exports = {
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    addLangAttribute,
    validateLandmark,
    validateLandmarkAttributes,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    addSvgAccessibilityProps,
    createInPageButton,
    createAccessibleLink,
    handleAccessibilityIssues,
    generateAccessibilityReport,
    googleSignIn,
    fixButtonIdentifiers,
    ensureDependencyGraphAriaRole,
    createAddBookForm,
    validateBookFormAccessibility,
    fixTableStructure,
    addMainLandmark,
    setSvgAttributes,
    validateLinkAccessibility,
    handleFakeLinks,
    addProperLandmarkRegions
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
    issues.push('Missing both text and aria-label');
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
 * Sets SVG attributes to ensure accessibility
 * @param {Object} svg - The SVG element
 * @param {Object} attributes - Attributes to set
 * @returns {Object} The updated SVG element
 */
function setSvgAttributes(svg, attributes) {
  return {
    ...svg,
    ...attributes,
    accessibleName: getSvgAccessibleName(svg)
  };
}

/**
 * Adds proper landmark regions to the document
 * @param {Array} landmarks - Array of landmark elements to add
 * @returns {Object} Result with success status and any issues found
 */
function addProperLandmarkRegions(landmarks) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  landmarks.forEach((landmark, index) => {
    if (!validLandmarks.includes(landmark.tagName.toLowerCase())) {
      issues.push({
        landmarkIndex: index,
        issue: `Invalid landmark: ${landmark.tagName}`
      });
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
  validateLandmarkStructure,
  validateLandmarkAttributes,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues,
  validateLinkAccessibility,
  setSvgAttributes,
  addProperLandmarkRegions
};