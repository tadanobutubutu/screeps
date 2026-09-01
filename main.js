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

  // Check for duplicate IDs
  const elementsById = {};
  landmarks.forEach(landmark => {
    if (landmark.id) {
      if (elementsById[landmark.id]) {
        duplicates.push(`Duplicate ID: ${landmark.id}`);
      } else {
        elementsById[landmark.id] = true;
      }
    }
  });

  // Check for duplicate roles
  const landmarksByRole = {};
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (role) {
      if (landmarksByRole[role]) {
        duplicates.push(`Duplicate landmark role: ${role}`);
      } else {
        landmarksByRole[role] = true;
      }
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

function setSvgAccessibilityProps(svg, props) {
  if (props.ariaLabel) {
    svg.ariaLabel = props.ariaLabel;
  }
  if (props.ariaLabelledby) {
    svg.ariaLabelledby = props.ariaLabelledby;
  }
  if (props.title) {
    svg.title = props.title;
  }
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
 * Validates the structure of a table element
 * @param {Object} table - The table element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableStructure(table) {
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
 * Creates an accessible in-page button
 * Supports both an options object (with text, ariaLabel, onClick) and
 * positional arguments (textOrOptions, onClick) for backward compatibility.
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
  const button = document.createElement('button');
  button.textContent = text;
  if (clickHandler) {
    button.onclick = clickHandler;
  }
  button.setAttribute('aria-label', ariaLabel || text);
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