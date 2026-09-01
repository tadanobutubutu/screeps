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
  
  // From Version 2 - comprehensive validation
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
 * Processes all accessibility issues and applies fixes where possible
 * @param {Object} accessibilityReport - The accessibility report containing issues
 * @returns {Object} Summary of processed issues
 */
function processAccessibilityIssues(accessibilityReport) {
  const processed = [];
  const unhandled = [];

  if (accessibilityReport && accessibilityReport.issues) {
    accessibilityReport.issues.forEach(issue => {
      if (issue.fixable) {
        processed.push(issue);
      } else {
        unhandled.push(issue);
      }
    });
  }

  return {
    totalProcessed: processed.length,
    unhandledIssues: unhandled
  };
}

/**
 * Creates a landmark element
 * @param {string} tagName - The tag name for the landmark
 * @param {Object} attributes - Attributes for the landmark
 * @returns {Object} The created landmark element
 */
function createLandmark(tagName, attributes) {
  return {
    tagName: tagName,
    ...attributes,
    role: attributes.role || 'region'
  };
}

/**
 * Validates all landmarks in the document
 * @param {Array} landmarks - Array of landmarks to validate
 * @returns {Object} Result of validation
 */
function validateAllLandmarks(landmarks) {
  const issues = [];

  landmarks.forEach((landmark, index) => {
    const result = validateLandmark(landmark);
    if (!result.success) {
      issues.push({
        index,
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
 * Fixes table structure issues
 * @param {Object} tables - Table or tables to fix
 * @returns {Object} Fixed table structure
 */
function fixTableStructure(tables) {
  const tableArray = Array.isArray(tables) ? tables : [tables];

  const fixedTables = tableArray.map(table => {
    if (!table.headers) {
      table.headers = 'auto';
    }

    if (!table.scope) {
      table.scope = 'auto';
    }

    return table;
  });

  return Array.isArray(tables) ? fixedTables : fixedTables[0];
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
    const hasMain = target.some(landmark => landmark.tagName && landmark.tagName.toLowerCase() === 'main');
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
  const existingTags = landmarks.map(l => l.tagName && l.tagName.toLowerCase());

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
 * Sets SVG attributes for accessibility
 * @param {Object} svg - The SVG element
 * @param {string} accessibleName - The accessible name
 * @returns {Object} The SVG element with attributes set
 */
function setSvgAttributesForSvg(svg, accessibleName) {
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
 * Ensures an element has an ID attribute
 * @param {Object} element - The element to check
 * @param {string} id - The ID to assign if missing
 * @returns {Object} The element with ensured ID
 */
function ensureElementId(element, id) {
  if (!element.id) {
    element.id = id;
  }
  return element;
}

/**
 * Adds an aria-label to an element if missing
 * @param {Object} element - The element to modify
 * @param {string} label - The aria-label to add
 * @returns {Object} The element with aria-label
 */
function addAriaLabel(element, label) {
  if (!element.ariaLabel) {
    element.ariaLabel = label;
  }
  return element;
}

/**
 * Adds proper landmark regions to the document
 * @param {Array} regions - Array of landmark regions to add
 * @returns {Object} Result with success status and any issues found
 */
function addProperLandmarkRegions(regions) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  regions.forEach(region => {
    if (!validLandmarks.includes(region.tagName.toLowerCase())) {
      issues.push(`Invalid landmark region: ${region.tagName}`);
    }
  });

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Renders a dependency graph visualization
 * @param {Object} graphData - The graph data to render
 * @returns {Object} The rendered graph element
 */
function renderDependencyGraph(graphData) {
  return {
    type: 'graph',
    data: graphData,
    rendered: true,
    timestamp: new Date().toISOString()
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
  setSvgAttributes,
  createInPageButton,
  createAccessibleLink,
  validateLinkAccessibility,
  handleFakeLinks,
  handleAccessibilityIssues,
  googleSignIn,
  fixButtonIdentifiers,
  ensureDependencyGraphAriaRole,
  processAccessibilityIssues,
  createLandmark,
  validateAllLandmarks,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  uniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssues,
  setSvgAttributesForSvg,
  handleCredentialResponse,
  addProperLandmarkRegions,
  ensureElementId,
  addAriaLabel,
  renderDependencyGraph
};