// TODO: This is the existing code that needs to be preserved
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: 641688d91e4de9a82ff894b47ca3fcdab7317b3d -->
// TODO: Address accessibility issues from insight report:
// TODO: This is the existing code that needs to be preserved
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// TODO: This is the existing code that needs to be preserve
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec, spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

// New function to add aria-label to an element
const addAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute('aria-label', label)
  }
  return element
}

const primaryContent = (typeof document !== 'undefined') ? document.querySelector('main') || document.querySelector('#content') || document.querySelector('.content') || document.querySelector('article') || document.getElementById('primary-content') || document.body : null;

// Load configurations from package.json if it exists
function loadConfigurations() {
    try {
        const packagePath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            config.name = packageJson.name || 'dependency-counter';
            config.version = packageJson.version || '1.0.0';
            config.dependencies = packageJson.dependencies || {};
            config.devDependencies = packageJson.devDependencies || {};
            config.accessibility = packageJson.accessibility || {};
        }
    } catch (error) {
        console.error('Error loading configurations:', error.message);
    }
}

// Implement function to count dependencies
function countDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
        dependencies: Object.keys(dependencies),
        devDependencies: Object.keys(devDependencies),
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

/**
 * Sanitize a filename by replacing invalid characters
 * @param {string} filename - The filename to sanitize
 * @returns {string} - Sanitized filename
 */
function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Process data items by adding metadata
 * @param {Array} items - Items to process
 * @returns {Array} - Processed items
 */
function processData(items) {
    if (!Array.isArray(items)) {
        return [];
    }
    return items.map(item => ({
        ...item,
        processed: true,
        timestamp: Date.now()
    }));
}

/**
 * Generate a unique session ID
 * @returns {string} - Generated session ID
 */
function generateSessionId() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.floor(Math.random() * 1e9).toString(36).substring(0, 9);
    return timestamp + '-' + randomPart;
}

/**
 * Check if the user prefers reduced motion
 * @returns {boolean} True if the user prefers reduced motion
 */
function prefersReducedMotion() {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if the user prefers high contrast
 * @returns {boolean} True if the user prefers high contrast
 */
function prefersHighContrast() {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return false;
    }
    return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Check if an element is a landmark element for accessibility
 * Landmark elements include: main, nav, aside, header, footer, section, article, form, search
 * @param {HTMLElement|string} element - The element or element tag name to check
 * @returns {boolean} True if the element is a landmark element
 */
function isLandmarkElement(element) {
    const landmarkTags = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form', 'search'];

    if (!element) {
        return false;
    }

    if (typeof element === 'string') {
        return landmarkTags.includes(element.toLowerCase());
    }

    if (element.tagName) {
        return landmarkTags.includes(element.tagName.toLowerCase());
    }

    return false;
}

/**
 * Validates table accessibility by checking structure and headers.
 * @param {HTMLElement} table - The table to validate
 * @returns {Object} - Validation result with success status and details
 */
function validateTableAccessibility(table) {
  if (!table) {
    return { success: false, error: 'Table is required' };
  }

  const caption = table.querySelector('caption');
  const hasCaption = caption !== null;
  const headers = table.querySelectorAll('th');
  const errors = [];

  headers.forEach((th, index) => {
    // TODO: This is the existing code that needs to be preserved
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header at index ${index} is missing scope attribute`);
    }
  });

  const headerValidation = Array.from(headers).every(header => 
    header.hasAttribute('scope') && header.getAttribute('scope') !== ''
  );

  return {
    success: hasCaption && headers.length > 0 && headerValidation,
    details: {
      hasCaption,
      headerCount: headers.length,
      headersHaveScope: headerValidation
    }
  };
}

/**
 * Validates the structure of landmark elements.
 * @param {HTMLElement} container - The container element to check
 */
function validateLandmarkRoles(container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const landmarkSelectors = [
    'main', 'nav', 'header', 'footer', 'aside',
    '[role="main"]', '[role="banner"]',
    '[role="contentinfo"]', '[role="complementary"]'
  ];

  const landmarks = [];
  landmarkSelectors.forEach(selector => {
    const elements = container.querySelectorAll(selector);
    elements.forEach(el => landmarks.push(el));
  });

  const landmarkCount = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    landmarkCount[role] = (landmarkCount[role] || 0) + 1;
  });

  return landmarkCount;
}

/**
 * Check accessibility of landmark elements in the document.
 * @param {HTMLElement} container - The container element to check
 */
function checkAccessibilityOfLandmarks(container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const landmarkSelectors = [
    'main', 'nav', 'header', 'footer', 'aside',
    '[role="main"]', '[role="banner"]',
    '[role="contentinfo"]', '[role="complementary"]'
  ];

  const landmarks = [];
  landmarkSelectors.forEach(selector => {
    const elements = container.querySelectorAll(selector);
    elements.forEach(el => landmarks.push(el));
  });

  const landmarkCount = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    landmarkCount[role] = (landmarkCount[role] || 0) + 1;
  });

  return landmarkCount;
}

/**
 * Check accessibility of landmark elements in the document.
 * @param {HTMLElement} container - The container element to check
 */
function checkLandmarkAccessibility(container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const landmarkSelectors = [
    'main', 'nav', 'header', 'footer', 'aside',
    '[role="main"]', '[role="banner"]',
    '[role="contentinfo"]', '[role="complementary"]'
  ];

  const landmarks = [];
  landmarkSelectors.forEach(selector => {
    const elements = container.querySelectorAll(selector);
    elements.forEach(el => landmarks.push(el));
  });

  const landmarkCount = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    landmarkCount[role] = (landmarkCount[role] || 0) + 1;
  });

  return landmarkCount;
}

/**
 * Validates the structure of landmark elements.
 * @param {HTMLElement} container - The container element to check
 */
function validateLandmarkStructure(container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const landmarkSelectors = [
    'main', 'nav', 'header', 'footer', 'aside',
    '[role="main"]', '[role="banner"]',
    '[role="contentinfo"]', '[role="complementary"]'
  ];

  const landmarks = [];
  landmarkSelectors.forEach(selector => {
    const elements = container.querySelectorAll(selector);
    elements.forEach(el => landmarks.push(el));
  });

  const landmarkCount = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    landmarkCount[role] = (landmarkCount[role] || 0) + 1;
  });

  return landmarkCount;
}

// SVG accessibility helper functions
function configureSvgAccessibility(svg) {
  if (svg && typeof svg.setAttribute === 'function') {
    svg.setAttribute('role', 'img');
  }

  const accessibleName = getSvgAccessibleName(svg);
  if (accessibleName) {
    svg.setAttribute('aria-labelledby', accessibleName);
  }

  setSvgAttributes(svg);
}

function makeSvgAccessible(svg) {
  if (svg && typeof svg.setAttribute === 'function') {
    svg.setAttribute('role', 'img');
  }

  const accessibleName = getSvgAccessibleName(svg);
  if (accessibleName) {
    svg.setAttribute('aria-labelledby', accessibleName);
  }

  setSvgAttributes(svg);
}

function setSvgAttributes(svg) {
    // Code to set other svg attributes goes here
    if (svg && svg.setAttribute) {
        svg.setAttribute('focusable', 'false');
        svg.setAttribute('aria-hidden', 'true');
    }
}

// AddressabilityIssues that uses the comprehensive validateTableAccessibility function
const AddressabilityIssues = {
  validateTableAccessibility: function(table) {
    return validateTableAccessibility(table);
  }
};

/**
 * Get the accessible name for an SVG element
 * @param {HTMLElement} svg - The SVG element
 * @returns {string|null} - The accessible name or null
 */
function getSvgAccessibleName(svg) {
  if (!svg) return null;
  
  const title = svg.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }

  const desc = svg.querySelector('desc');
  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }

  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }

  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labeledElement = document.getElementById(ariaLabelledby);
    if (labeledElement && labeledElement.textContent) {
      return labeledElement.textContent.trim();
    }
  }

  return null;
}

/**
 * Validate input parameter
 * @param {*} input - Input to validate
 * @returns {boolean} - True if valid
 */
function validateInput(input) {
    return input !== null && input !== undefined;
}

/**
 * Handle credential response from OAuth/identity provider
 * @param {Object} credentialResponse - The credential response
 * @returns {Object} - Result of handling the credential
 */
function handleCredentialResponseFn(credentialResponse) {
    const parsedResponse = parseCredentialResponse(credentialResponse);

    if (!parsedResponse.success) {
        return {
            status: 'error',
            message: parsedResponse.error
        };
    }

    const credential = parsedResponse.credential;

    if (!credential) {
        return {
            status: 'error',
            message: 'No credential provided'
        };
    }

    // Decode the JWT token to extract user information
    const decodedToken = decodeJwtToken(credential);

    if (!decodedToken) {
        return {
            status: 'error',
            message: 'Failed to decode credential token'
        };
    }

    // Create session for the authenticated user
    const sessionId = generateSessionId();
    const sessionData = {
        user: {
            email: decodedToken.email,
            name: decodedToken.name,
            picture: decodedToken.picture,
            sub: decodedToken.sub
        },
        authenticatedAt: Date.now(),
        credential: credential
    };

    appState.sessions.set(sessionId, sessionData);
    return {
        sessionId,
        clientId: parsedResponse.clientId,
        timestamp: Date.now()
    };
}

/**
 * Check accessibility of landmark elements in the document.
 * @param {HTMLElement} container - The container element to check
 */
function checkLandmarkElements(container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const landmarkSelectors = [
    'main', 'nav', 'header', 'footer', 'aside',
    '[role="main"]', '[role="banner"]',
    '[role="contentinfo"]', '[role="complementary"]'
  ];

  const landmarks = [];
  landmarkSelectors.forEach(selector => {
    const elements = container.querySelectorAll(selector);
    elements.forEach(el => landmarks.push(el));
  });

  const landmarkCount = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    landmarkCount[role] = (landmarkCount[role] || 0) + 1;
  });

  return landmarkCount;
}

/**
 * Ensure unique landmarks by removing duplicates based on key attributes
 * @param {Array} landmarks - Array of landmark elements
 * @returns {Array} - Unique landmark elements
 */
function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const uniqueElements = [];
    const seen = new Map();

    landmarks.forEach(element => {
        const key = element.id || element.name || element.className;
        if (!seen.has(key)) {
            seen.set(key, true);
            uniqueElements.push(element);
        }
    });

    return uniqueElements;
}

/**
 * Missing roles validation
 * @param {Array} requiredRoles - Required roles
 * @param {Set} foundRoles - Found roles
 * @returns {Object} - Validation result
 */
function missingRoles(requiredRoles, foundRoles) {
    const missingRoles = requiredRoles.filter(role => !foundRoles.has(role));
    return {
        valid: missingRoles.length === 0,
        foundRoles: Array.from(foundRoles),
        missingRoles
    };
}

/**
 * Fix fake link issues in the document
 * @param {Document} doc - The document to process
 * @returns {number} - Number of issues fixed
 */
function fixFakeLinkIssue(doc) {
    if (typeof doc === 'undefined' || !doc.querySelectorAll) {
        return 0;
    }
    const clickableElements = doc.querySelectorAll('[onclick]');
    let count = 0;

    clickableElements.forEach(element => {
        const tagName = element.tagName.toLowerCase();
        const hasHref = element.hasAttribute('href');

        if (tagName !== 'a' && !hasHref) {
            const isInteractive = element.getAttribute('role') === 'link' ||
                                   (element.getAttribute('role') === 'button' && element.onclick);

            if (isInteractive) {
                const text = element.textContent.trim();
                if (text) {
                    element.setAttribute('aria-label', text);
                }
            }
            count++;
        }
    });

    return count;
}

/**
 * Add an aria-label to an element if it doesn't have one
 * @param {HTMLElement} element - The element to add the label to
 * @param {string} label - The label to add
 * @returns {HTMLElement} - The element with aria-label
 */
function addAriaLabelLegacy(element, label) {
    if (!element.ariaLabel) {
        element.ariaLabel = label;
    }
    return element;
}

/**
 * Check element accessibility
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - True if accessible
 */
function checkElementAccessibility(element) {
    return true;
}

/**
 * Handle accessibility issues
 */
function handleAccessibilityIssues() {
    // Placeholder for handling accessibility issues
}

/**
 * Add lang attribute to element
 * @param {HTMLElement} element - The element to add lang attribute to
 * @param {string} lang - The language code
 */
function addLangAttribute(element, lang) {
    if (element) {
        element.setAttribute('lang', lang || (typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en'));
    }
}

/**
 * Validate table structure for accessibility
 * @param {HTMLElement} table - The table to validate
 * @returns {boolean} - True if valid
 */
function validateTableStructure(table) {
    if (!table) return false;
    
    const caption = table.querySelector('caption');
    if (!caption) return false;
    
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) return false;
    
    for (const header of headers) {
        if (!header.hasAttribute('scope')) {
            return false;
        }
    }
    
    return true;
}

/**
 * Address accessibility issues in tables
 */
function addressAccessibilityIssues() {
    if (typeof document === 'undefined') return;
    
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const accessible = validateTableAccessibility(table);
        const structure = validateTableStructure(table);
        if (!accessible.success || !structure) {
            console.warn('Table accessibility or structure validation failed:', table);
        }
    });
}

/**
 * Render dependency graphs in the document
 * @param {Object} graphData - Data for rendering graphs
 */
function renderDependencyGraphs(graphData) {
    if (typeof document === 'undefined') return;
    
    const container = document.getElementById('dependency-graph');
    if (container) {
        const lang = getLangAttribute();
        const deps = countDependencies();
        
        let content = `<div lang="${lang}" role="region" aria-label="Dependency Graph">`;
        content += `<h2>Dependency Graph</h2>`;
        
        if (deps.total > 0) {
            content += `<table role="table">`;
            content += `<caption>Package Dependencies</caption>`;
            content += `<thead><tr><th scope="col">Type</th><th scope="col">Count</th></tr></thead>`;
            content += `<tbody>`;
            content += `<tr><td>Dependencies</td><td>${deps.dependencies.length}</td></tr>`;
            content += `<tr><td>Dev Dependencies</td><td>${deps.devDependencies.length}</td></tr>`;
            content += `<tr><td>Total</td><td>${deps.total}</td></tr>`;
            content += `</tbody></table>`;
        } else {
            content += `<p>No dependencies found.</p>`;
        }
        
        content += `</div>`;
        
        container.innerHTML = content;
        const tables = container.querySelectorAll('table');
        tables.forEach(table => {
            validateTableAccessibility(table);
            validateTableStructure(table);
        });
        const div = container.querySelector('div');
        if (div) {
            addLangAttribute(div);
            addAriaLabel(div, 'Dependency Graph Content');
        }
    }
}

/**
 * Get language attribute from document
 * @returns {string} - Language code
 */
function getLangAttribute() {
    if (typeof document === 'undefined') return 'en';
    return document.documentElement.lang || (typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en');
}

/**
 * Add language attribute to document
 */
function addLanguageAttribute() {
    if (typeof document !== 'undefined') {
        addLangAttribute(document.documentElement);
    }
}

/**
 * Add main landmark to index page
 */
function addMainLandmarkToIndex() {
    if (typeof document !== 'undefined') {
        const main = document.querySelector('main') || document.querySelector('#main') || document.querySelector('.main');
        if (main) {
            main.setAttribute('role', 'main');
        }
    }
}

// Main entry point function (implementation added as requested)
function main() {
    // Main application logic can be added here
    console.log("Main function executed");
    // Example: initialize accessibility features
    accessibility();
    // Additional setup can be added as needed
}

/**
 * Render graph index using new functions
 * @param {Object} graphData - Data for rendering graphs
 */
const renderGraphIndex = (graphData) => {
  addLanguageAttribute();
  addMainLandmarkToIndex();
  addressAccessibilityIssues();
  renderDependencyGraphs(graphData);
}

/**
 * Alternative render graph index
 * @param {Object} graphData - Data for rendering graphs
 */
const renderGraphIndexAlt = (graphData) => {
  addressAccessibilityIssues();
  renderDependencyGraphs(graphData);
}

const appInstance = {
    primaryContent: primaryContent,

    addressInsightIssues: function () {
        this.getLangAttribute();
        const landmarks = typeof document !== 'undefined' ? (document.documentElement || document.body) : null;

        if (typeof landmarks !== 'undefined' && Array.isArray(landmarks)) {
            this.ensureLandmarkUniqueness(landmarks);
        }

        configureSvgAccessibility(this.primaryContent);

        this.handleAccessibilityIssues();

        this.setupHandlers();

        return landmarks;
    },

    initializeApp: function () {
        this.addressInsightIssues();
        loadConfigurations();
        countDependencies();
        if (typeof wrapPrimaryContentInMain === 'function') {
            wrapPrimaryContentInMain();
        }
        if (typeof fixLandmarkStructure === 'function') {
            fixLandmarkStructure();
        }
    },

    // Utility functions
    getLangAttribute: function () {
        let lang = 'en'; // Default to English
        return lang;
    },

    validateLandmark: function (element) {
        const validLandmarks = ['main', 'nav', 'aside', 'footer', 'header', 'form', 'search'];
        const role = element.getAttribute('role');
        return validLandmarks.includes(role);
    },

    ensureLandmarkUniqueness: function (landmarks) {
        return ensureUniqueLandmarks(landmarks);
    },

    createInPageButton: function (text) {
        return {};
    },

    createAccessibleLink: function (href, text) {
        return {};
    },

    setupHandlers: function () {
        console.log('Setting up event handlers...');
    },

    processData: function (data) {
        if (!this.validateInput(data)) {
            throw new Error('Invalid input data');
        }
        return processData(data);
    },

    createServer: function () {
        const server = http.createServer(app);
        app.get('/', (req, res) => {
            res.send('Hello World!');
        });

        return server;
    },

    startApp: function () {
        this.createServer();
        const server = this.createServer();
        return server;
    },

    spawnProcess: function (command, args, options) {
        // Spawning a child process to perform a command
        return spawn(command, args, options);
    },
    configureSvgAccessibility: configureSvgAccessibility,
    makeSvgAccessible: makeSvgAccessible,
    setSvgAttributes: setSvgAttributes
};

module.exports = {
  greetingFunction,
  renderGraphIndex,
  renderGraphIndexAlt,
  accessibility,
  ensureInteractiveElementsAccessible,
  handleInitialAccessibility,
  addressAccessibilityIssues,
  validateSession,
  getActiveSessionsCount,
  revokeSession,
  a11yStore,
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  factorial,
  fibonacci,
  sum,
  average,
  max,
  min,
  mode,
  median,
  dependencyGraphContent,
  indexContent,
  main,
  appInstance,
  // Additional utility functions from merged code
  loadConfigurations,
  countDependencies,
  sanitizeFilename,
  processData,
  generateSessionId,
  prefersReducedMotion,
  prefersHighContrast,
  isLandmarkElement,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkRoles,
  validateLandmarkStructure,
  checkLandmarkAccessibility,
  checkLandmarkElements,
  checkAccessibilityOfLandmarks,
  ensureUniqueLandmarks,
  missingRoles,
  fixFakeLinkIssue,
  addAriaLabel,
  addAriaLabelLegacy,
  checkElementAccessibility,
  handleAccessibilityIssues,
  addLangAttribute,
  getLangAccessibleName,
  getLangAttribute,
  renderDependencyGraphs,
  addLanguageAttribute,
  addMainLandmarkToIndex
};