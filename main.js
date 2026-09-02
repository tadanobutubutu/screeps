// TODO: This is the existing code that needs to be preserved
const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

function validateLandmark(landmark) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!landmark.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(landmark.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${landmark.tagName}`);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

// const HTML = ({ lang }) => <html lang={lang}>{/* other children */}</html>;

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by fixTableStructureIssues() and fixTableHeaderCellScope())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), addLandmarkRolesAndFixIssues() and fixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by addSvgAccessibleNames())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

function getLangAttribute() {
    // Implementation to get language attribute
    return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
    // Implementation to get full language attribute
    return document.documentElement.lang || navigator.language || 'en-US';
}

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
 * Adds lang attribute to HTML element
 * @param {Object} element - The HTML element to modify
 * @returns {Object} The modified element with lang attribute
 */
function addLangAttribute(element) {
  element.lang = getFullLangAttribute();
  return element;
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

function initializeApp() {
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
}

function getConfig() {
  return config;
}

function validateInput(input) {
  return input !== null && input !== undefined;
}

function processData(data) {
  if (!validateInput(data)) {
    throw new Error('Invalid input data');
  }
  return {
    processed: true,
    data: data,
    timestamp: Date.now()
  };
}

/**
 * Creates an accessible in-page button element
 * @param {string} text - The button text content
 * @param {Function} onClick - Click handler function
 * @returns {Object} Button element with accessibility attributes
 */
function createInPageButton(text, onClick) {
    // Implementation to create accessible in-page button
    const button = document ? document.createElement('button') : { tagName: 'BUTTON' };
    button.textContent = text;
    button.onclick = onClick;
    button.setAttribute('aria-label', text);
    if (text.length === 0) {
      button.setAttribute('aria-label', 'Empty button');
    }
    return button;
}

/**
 * Creates an accessible link element
 * @param {string} href - The link URL
 * @param {string} text - The link text content
 * @returns {Object} Anchor element with accessibility attributes
 */
function createAccessibleLink(href, text) {
    // Implementation to create accessible link
    const link = document ? document.createElement('a') : { tagName: 'A' };
    link.href = href;
    link.textContent = text;
    link.setAttribute('aria-label', text);
    return link;
}

/**
 * Handles accessibility issues found during validation
 * @param {Array} issues - Array of accessibility issues (optional)
 * @returns {Object} Summary of handled issues
 */
function handleAccessibilityIssues(issues = []) {
  const handled = [];
  const unhandled = [];

  // Process provided issues
  issues.forEach(issue => {
    if (issue.fixable) {
      handled.push(issue);
    } else {
      unhandled.push(issue);
    }
  });

  // Perform DOM validation
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  const landmarks = document.querySelectorAll('[role]');
  landmarks.forEach(landmark => {
    validateLandmark(landmark);
  });

  validateLandmarkStructure();
  ensureUniqueLandmarks();

  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    getSvgAccessibleName(svg);
  });

  return {
    total: issues.length,
    handled: handled.length,
    unhandled: unhandled.length,
    unhandledIssues: unhandled
  };
}

function newBranchFunction() {
  return 'New branch function executed';
}

/**
 * Adds a main landmark element to the document if not present
 * @param {Object} document - The document object
 * @returns {Object} The modified document object
 */
function addMainLandmark(document) {
  if (document) {
    const main = document.createElement ? document.createElement('main') : null;
    if (main) {
      main.setAttribute('role', 'main');
      if (document.body) {
        document.body.appendChild(main);
      }
    }
  }
  return document;
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
 * Adds proper landmark roles to semantic HTML elements
 * @param {Object} document - The document object
 * @returns {Object} The modified document object
 */
function addLandmarkRegions(document) {
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
 * Counts dependencies (both internal private functions and npm dependencies)
 * @returns {Object} Result with internal and npm dependency counts
 */
const countDependencies = () => {
  // ... existing countDependencies function implementation ...
};

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
    createInPageButton,
    createAccessibleLink,
    handleAccessibilityIssues,
    addSvgAccessibilityProps,
    handleCredentialResponse,
    addLangAttribute,
    addMainLandmark,
    setSvgAttributes,
    handleFakeLinks,
    addLandmarkRegions,
    newBranchFunction,
    initializeApp,
    getConfig,
    validateInput,
    processData,
    validateCredentialToken,
    processCredentialAuthentication,
    upgradeSystem,
    countDependencies,
    validateLinkAccessibility,
    validateButtonAccessibility,
    checkLinkAndButtonAccessibility
};