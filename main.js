// TODO: This is the existing code that needs to be preserved
const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by fixTableStructureIssues() and fixTableHeaderCellScope())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), addLandmarkRolesAndFixIssues() and fixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by addSvgAccessibleNames())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

/**
 * Validates table accessibility compliance
 * @param {Object} table - The table object to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableAccessibility(table) {
  const issues = [];

  // Check for caption
  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  // Check for headers attribute
  if (!table.getAttribute('headers')) {
    issues.push('Missing headers attribute');
  }

  // Check for scope attribute on header cells
  const headerCells = table.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      issues.push('Missing scope attribute on header cell');
    }
  });

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates the structure of tables for accessibility
 * @param {Array|Object} tables - Array of table objects or single table element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableStructure(tables) {
  const allIssues = [];

  // Handle both single table element and array of tables
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
 * @param {Object} svgElement - The SVG element
 * @returns {string} The accessible name for the SVG
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return 'Accessible SVG Icon';

  const title = svgElement.querySelector ? svgElement.querySelector('title') : null;
  const ariaLabel = svgElement.getAttribute ? svgElement.getAttribute('aria-label') : null;
  if (title) return title.textContent || title.textContent;
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

  if (options.ariaHidden !== undefined) {
    enhancedSvg.ariaHidden = options.ariaHidden;
  }

  if (options.role) {
    enhancedSvg.role = options.role;
  }

  // Ensure the SVG has an accessible name
  if (!enhancedSvg.ariaLabel && !enhancedSvg.ariaLabelledby && !enhancedSvg.title) {
    enhancedSvg.title = 'SVG graphic';
  }

  return enhancedSvg;
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

  // If landmarks array is provided, validate each one
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
    const allLandmarks = document ? document.querySelectorAll('[role]') : [];
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

  // If no landmarks array provided, query the DOM
  const elementsToCheck = Array.isArray(landmarks) ? landmarks : (document ? document.querySelectorAll('[role]') : []);

  // Check for duplicate accessible names
  elementsToCheck.forEach(landmark => {
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
  elementsToCheck.forEach(landmark => {
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
  elementsToCheck.forEach(landmark => {
    const role = landmark.getAttribute ? landmark.getAttribute('role') : null;
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
 * Counts dependencies (both internal private functions and npm dependencies)
 * @returns {Object} Result with internal and npm dependency counts
 */
function countDependencies() {
  const internalFunctions = [
    'config',
    'appState',
    'validateLandmark',
    'appData',
    'getLangAttribute',
    'getFullLangAttribute',
    'validateTableAccessibility',
    'validateTableStructure',
    'getSvgAccessibleName',
    'addSvgAccessibilityProps',
    'addLangAttribute',
    'validateLandmark',
    'validateLandmarkAttributes',
    'validateLandmarkStructure',
    'ensureUniqueLandmarks',
    'initializeApp',
    'getConfig',
    'validateInput',
    'processData',
    'createInPageButton',
    'createAccessibleLink',
    'handleAccessibilityIssues',
    'newBranchFunction',
    'addMainLandmark',
    'setSvgAttributes',
    'handleFakeLinks',
    'addLandmarkRegions',
    'validateLinkAccessibility',
    'validateButtonAccessibility',
    'checkLinkAndButtonAccessibility',
    'handleCredentialResponse',
    'validateCredentialToken',
    'processCredentialAuthentication',
    'upgradeSystem'
  ].concat( // Include the new functions
     ['addProperLandmarkRegions', 'replaceMyButton', 'ensureDependencyGraphAriaRole', 'ensureElementHasId', 'addAriaLabel', 'renderDependencyGraphs']
   );

  let npmDependencies = 0;
  try {
    const fs = require('fs');
    const path = require('path');
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      npmDependencies = Object.keys(packageJson.dependencies || {}).length;
    }
  } catch (e) {
    // If we can't read package.json, npmDependencies stays 0
  }

  return {
    internal: internalFunctions.length,
    npm: npmDependencies
  };
}

/**
 * Gets the lang attribute value
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  return document && document.documentElement ? document.documentElement.lang || 'en' : 'en';
}

/**
 * Gets the full lang attribute value
 * @returns {string} The full lang attribute value
 */
function getFullLangAttribute() {
  return document && document.documentElement ? document.documentElement.lang || document && navigator.language || 'en-US' : 'en-US';
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
 * Adds accessible names to SVG elements
 * @param {Object} svgElement - The SVG element
 * @param {string} accessibleName - The accessible name to add
 * @returns {Object} The SVG element with accessible name
 */
function addSvgAccessibleNames(svgElement, accessibleName) {
  if (!svgElement) return null;
  
  if (svgElement.setAttribute) {
    svgElement.setAttribute('role', 'img');
    if (accessibleName) {
      svgElement.setAttribute('aria-label', accessibleName);
    }
  }
  
  return svgElement;
}

/**
 * Sets SVG accessibility attributes
 * @param {Object} svg - The SVG element
 * @param {string} accessibleName - The accessible name for the SVG
 * @returns {Object} The SVG element with accessibility attributes
 */
function setSvgAttributes(svg, accessibleName) {
  if (svg && typeof svg === 'object') {
    if (svg.setAttribute) {
      svg.setAttribute('role', 'img');
      if (accessibleName) {
        svg.setAttribute('aria-label', accessibleName);
      }
    }
  }
  return svg;
}

/**
 * Adds main landmark element
 * @param {Object} element - The element to convert to main landmark
 * @returns {Object} The element with main landmark role
 */
function addMainLandmark(element) {
  if (!element) return null;
  
  if (element.setAttribute) {
    element.setAttribute('role', 'main');
  }
  
  return element;
}

/**
 * Adds landmark roles and fixes related issues
 * @param {Object} element - The element to process
 * @returns {Object} The processed element
 */
function addLandmarkRolesAndFixIssues(element) {
  if (!element) return null;
  
  const landmarkMap = {
    header: 'banner',
    nav: 'navigation',
    main: 'main',
    aside: 'complementary',
    footer: 'contentinfo'
  };
  
  if (element.tagName && landmarkMap[element.tagName.toLowerCase()]) {
    if (!element.getAttribute('role')) {
      element.setAttribute('role', landmarkMap[element.tagName.toLowerCase()]);
    }
  }
  
  return element;
}

/**
 * Fixes landmark issues
 * @param {Object} element - The element to fix
 * @returns {Object} The fixed element
 */
function fixLandmarkIssues(element) {
  if (!element) return null;
  
  if (!element.hasAttribute('id') && element.setAttribute) {
    element.setAttribute('id', 'landmark-' + Math.random().toString(36).substr(2, 9));
  }
  
  return element;
}

/**
 * Handles fake links by converting them to accessible buttons
 * @param {Object} link - The link element to fix
 * @returns {Object} Button element for fake links, original link otherwise
 */
function handleFakeLinks(link) {
  if (link.href === '#' || link.href === 'javascript:void(0)' || link.href === '') {
    return {
      text: link.textContent,
      onClick: link.onclick
    };
  }
  return link;
}

/**
 * Adds proper landmark regions to semantic HTML elements
 * @param {Object} document - The document object
 * @returns {Object} The modified document object
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
    const elements = document && document.querySelectorAll ? document.querySelectorAll(region.selector) : [];
    elements.forEach(element => {
      if (!element.getAttribute('role')) {
        element.setAttribute('role', region.role);
      }
    });
  });

  return document;
}

/**
 * Adds landmark regions to element
 * @param {Object} element - The element to process
 * @returns {Object} The processed element
 */
function addLandmarkRegions(element) {
  if (!element) return null;
  
  const landmarkMap = {
    header: 'banner',
    nav: 'navigation',
    main: 'main',
    aside: 'complementary',
    footer: 'contentinfo'
  };
  
  if (element.tagName && landmarkMap[element.tagName.toLowerCase()]) {
    if (!element.getAttribute('role')) {
      element.setAttribute('role', landmarkMap[element.tagName.toLowerCase()]);
    }
  }
  
  return element;
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

  if (!link.textContent && !link.ariaLabel && !link.ariaLabelledby) {
    issues.push('Link missing accessible name');
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates button accessibility
 * @param {Object} button - The button element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateButtonAccessibility(button) {
  const issues = [];

  if (!button.textContent && !button.ariaLabel && !button.ariaLabelledby) {
    issues.push('Button missing accessible name');
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Checks accessibility of links and buttons
 * @param {Array|Object} elements - Single element or array of elements to check
 * @returns {Object} Validation result with success status and any issues found
 */
function checkLinkAndButtonAccessibility(elements) {
  const allIssues = [];

  const elementsToCheck = Array.isArray(elements) ? elements : [elements];

  elementsToCheck.forEach((element, index) => {
    const result = (element.tagName && element.tagName.toLowerCase() === 'a')
      ? validateLinkAccessibility(element)
      : validateButtonAccessibility(element);

    if (!result.success) {
      allIssues.push({
        elementIndex: index,
        elementTag: element.tagName ? element.tagName.toLowerCase() : 'unknown',
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
 * Handles the credential response from an authentication flow
 * @param {Object} credentialResponse - The response object from credential provider
 * @returns {Object} Result with success status and parsed credential data
 */
function handleCredentialResponse(credentialResponse) {
  const issues = [];

  if (!credentialResponse) {
    return {
      success: false,
      issues: ['No credential response provided']
    };
  }

  if (credentialResponse.error) {
    issues.push(`Credential error: ${credentialResponse.error}`);
  }

  if (!credentialResponse.credential) {
    issues.push('Missing credential field');
  }

  let userData = null;
  if (credentialResponse.email) {
    userData = {
      email: credentialResponse.email,
      name: credentialResponse.name || '',
      picture: credentialResponse.picture || ''
    };
  }

  let parsedCredential = null;
  if (credentialResponse.credential) {
    try {
      const parts = credentialResponse.credential.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        parsedCredential = {
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          iss: payload.iss,
          aud: payload.aud,
          exp: payload.exp,
          iat: payload.iat
        };
      }
    } catch (parseError) {
      issues.push('Failed to parse credential token');
    }
  }

  const success = issues.length === 0 && !credentialResponse.error;

  return {
    success,
    issues,
    userData: userData || parsedCredential,
    credential: credentialResponse.credential,
    parsedCredential
  };
}

/**
 * Validates a credential token
 * @param {string} token - The credential token to validate
 * @returns {Object} Validation result with success status and token data
 */
function validateCredentialToken(token) {
  const issues = [];

  if (!token) {
    return {
      success: false,
      issues: ['No token provided']
    };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    issues.push('Invalid token format: expected JWT structure');
  }

  let tokenData = null;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    tokenData = payload;

    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        issues.push('Token has expired');
      }
    }

    if (!payload.email) {
      issues.push('Token missing email claim');
    }
  } catch (parseError) {
    issues.push('Failed to decode token');
  }

  return {
    success: issues.length === 0,
    issues,
    tokenData
  };
}

/**
 * Processes the credential and returns appropriate authentication state
 * @param {Object} credentialResponse - The credential response to process
 * @returns {Object} Authentication state with user info and status
 */
function processCredentialAuthentication(credentialResponse) {
  const result = handleCredentialResponse(credentialResponse);

  if (!result.success) {
    return {
      authenticated: false,
      user: null,
      errors: result.issues
    };
  }

  const user = result.parsedCredential || result.userData;

  return {
    authenticated: true,
    user: {
      email: user.email,
      name: user.name,
      picture: user.picture
    },
    errors: []
  };
}

/**
 * Implements upgrade logic using harvested data to improve the system
 * This function checks environment variables for upgrade triggers and updates the system configuration accordingly.
 */
function upgradeSystem() {
  const env = process.env;
  const systemConfig = getConfig();

  if (env.UPGRADE_NEEDED) {
    const currentVer = systemConfig.version.split('.')[0];
    const newVer = (parseInt(currentVer, 10) + 1).toString();
    systemConfig.version = newVer + '.0.0';
    console.log(`System upgraded to version ${systemConfig.version}`);
  }

  return systemConfig;
}

/**
 * Gets configuration settings
 * @returns {Object} Configuration object
 */
function getConfig() {
  return {
    ...config
  };
}

/**
 * Validates input data
 * @param {Object} input - The input to validate
 * @returns {Object} Validation result
 */
function validateInput(input) {
  const issues = [];
  
  if (!input) {
    issues.push('Input is required');
  }
  
  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Processes input data
 * @param {Object} data - The data to process
 * @returns {Object} Processed data result
 */
function processData(data) {
  if (!data) return null;
  
  return {
    ...data,
    processed: true
  };
}

/**
 * Creates an in-page button
 * @param {string} text - Button text
 * @param {Function} onClick - Click handler
 * @returns {Object} Button element
 */
function createInPageButton(text, onClick) {
  return {
    tagName: 'button',
    text: text,
    onClick: onClick
  };
}

/**
 * Creates an accessible link
 * @param {string} href - Link URL
 * @param {string} text - Link text
 * @param {Function} onClick - Click handler
 * @param {string} ariaLabel - ARIA label
 * @returns {Object} Link element
 */
function createAccessibleLink(href, text, onClick, ariaLabel) {
  return {
    tagName: 'a',
    href: href,
    text: text,
    onClick: onClick,
    ariaLabel: ariaLabel
  };
}

/**
 * Handles accessibility issues
 * @param {Object} element - Element to process
 * @param {Object} options - Processing options
 * @returns {Object} Processed element
 */
function handleAccessibilityIssues(element, options = {}) {
  if (!element) return null;
  
  if (options.addLang) {
    addLangAttribute(element);
  }
  
  if (options.ensureLandmark) {
    addLandmarkRegions(element);
  }
  
  return element;
}

/**
 * Initializes the application
 * @param {Object} config - Configuration object
 * @returns {Object} Initialization result
 */
function initializeApp(config) {
  appState.initialized = true;
  appState.data = config;
  return {
    success: true,
    initialized: appState.initialized
  };
}

/**
 * New branch function
 * @param {Object} data - Data to process
 * @returns {Object} Processed data
 */
function newBranchFunction(data) {
  if (!data) return null;
  return {
    ...data,
    branchProcessed: true
  };
}

/**
 * Adds proper landmark regions
 * @param {Object} element - Element to process
 * @returns {Object} Processed element
 */
function addProperLandmarkRegions(element) {
  return addLandmarkRegions(element);
}

/**
 * Replaces my button with accessible version
 * @param {Object} button - Button to replace
 * @returns {Object} Accessible button
 */
function replaceMyButton(button) {
  if (!button) return null;
  return createInPageButton(button.text, button.onClick);
}

/**
 * Ensures dependency graph aria role
 * @param {Object} element - Element to process
 * @returns {Object} Processed element
 */
function ensureDependencyGraphAriaRole(element) {
  if (!element) return null;
  if (element.setAttribute) {
    element.setAttribute('role', 'tree');
  }
  return element;
}

/**
 * Ensures element has ID
 * @param {Object} element - Element to process
 * @returns {Object} Element with ID
 */
function ensureElementHasId(element) {
  if (!element) return null;
  if (element.id || (element.setAttribute && element.setAttribute('id', 'auto-id-' + Date.now()))) {
    return element;
  }
  return element;
}

/**
 * Adds ARIA label to element
 * @param {Object} element - Element to process
 * @param {string} label - Label to add
 * @returns {Object} Processed element
 */
function addAriaLabel(element, label) {
  if (!element || !label) return element;
  if (element.setAttribute) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

/**
 * Renders dependency graphs
 * @param {Object} data - Data for rendering
 * @returns {Object} Rendered graph data
 */
function renderDependencyGraphs(data) {
  if (!data) return null;
  return {
    ...data,
    graphsRendered: true
  };
}

// Export all existing and new functions
module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkAttributes,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  addSvgAccessibilityProps,
  addLangAttribute,
  validateLandmark,
  validateLandmarkAttributes,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  initializeApp,
  getConfig,
  validateInput,
  processData,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues,
  newBranchFunction,
  addMainLandmark,
  setSvgAttributes,
  handleFakeLinks,
  addLandmarkRegions,
  validateLinkAccessibility,
  validateButtonAccessibility,
  checkLinkAndButtonAccessibility,
  handleCredentialResponse,
  validateCredentialToken,
  processCredentialAuthentication,
  upgradeSystem,
  addProperLandmarkRegions,
  addSvgAccessibleNames,
  replaceMyButton,
  ensureDependencyGraphAriaRole,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  countDependencies
};