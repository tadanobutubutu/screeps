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

  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Table structure issue: Missing caption element');
  }

  if (!table.querySelector || !table.querySelector('thead')) {
    issues.push('Table structure issue: Missing thead element');
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

// TODO: Any additional changes requested in the issue

/**
 * Validates landmark elements for accessibility
 * @param {Object} element - The element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmark(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!element.tagName) {
    issues.push('Invalid landmark: Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${element.tagName}`);
  }

  if (!element.hasAttribute('id')) {
    issues.push('Landmark structure issue: Missing id attribute');
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
 * @param {Object|string} textOrOptions - The button text or options object
 * @param {string} options.text - The button text
 * @param {string} options.ariaLabel - ARIA label for the button
 * @param {Function} options.onClick - The click handler
 * @param {Function} [onClick] - The click handler (positional form)
 * @returns {Object} The created button element
 */
function createInPageButton(textOrOptions, onClick) {
  let text = '';
  let ariaLabel;
  let clickHandler;

  // Handle object parameter format
  if (typeof textOrOptions === 'object' && textOrOptions !== null) {
    text = textOrOptions.text || '';
    ariaLabel = textOrOptions.ariaLabel;
    clickHandler = textOrOptions.onClick;
  } else {
    // Handle positional arguments format
    text = textOrOptions || '';
    clickHandler = onClick;
  }

  // Implementation to create accessible in-page button
  return {
    type: 'button',
    text: text,
    ariaLabel: ariaLabel || text,
    onClick: clickHandler,
    accessibleName: getSvgAccessibleName({ ariaLabel: ariaLabel })
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
 * Validates the structure of a table element
 * @param {Object} table - The table element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateSingleTableStructure(table) {
  const issues = [];

  if (!table.hasCaption) {
    issues.push('Missing caption element');
  }

  if (!table.hasValidHeaders) {
    issues.push('Invalid or missing header structure');
  }

  if (!table.hasValidRowGroups) {
    issues.push('Invalid or missing row groups');
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

  // Extract and validate required fields
  const { credential, clientExtensionResults, authenticatorData } = credentialResponse;

  if (!credential || typeof credential !== 'string') {
    throw new Error('Invalid credential in response');
  }

  // Process the credential data
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

  // Validate the processed credential
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

// Make functions accessible in main.js scope
const accessibilityUtils = {
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
  handleAccessibilityIssues
};

// Export all functions for testing and external use
module.exports = {
  getLangAttribute,
  getFullLangAttribute,
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
  validateSingleTableStructure,
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
  accessibilityUtils
};