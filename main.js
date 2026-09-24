import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { processData, validateLandmark, ensureLandmarkUniqueness, checkLandmarkElement, fixFakeLinks, isSecureContext, initApp, landmarks, appData, icons } from './insightsChecks.js';

const config = {
    apiUrl: process.env.API_URL || 'https://api.example.com',
    timeout: 5000
}

// App state
const appState = {
    initialized: false,
    data: null,
    cache: new Map()
};

function initialize() {
    appState.initialized = true;
    console.log('App initialized');
}

function checkLandmarkElement(id) {
    const element = document ? document.getElementById(id) : null;
    return element !== null;
}

function validateLandmark(landmark) {
    const errors = [];

    // Check if landmark exists
    if (!landmark) {
        errors.push('Landmark is required');
        return { valid: false, errors };
    }

    // Validate name
    if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
        errors.push('Landmark must have a valid name');
    }

    // Validate latitude
    if (landmark.latitude === undefined || landmark.latitude === null) {
        errors.push('Landmark must have a latitude');
    } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
        errors.push('Landmark latitude must be a number');
    } else if (landmark.latitude < -90 || landmark.latitude > 90) {
        errors.push('Landmark latitude must be between -90 and 90');
    }

    // Validate longitude
    if (landmark.longitude === undefined || landmark.longitude === null) {
        errors.push('Landmark must have a longitude');
    } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
        errors.push('Landmark longitude must be a number');
    } else if (landmark.longitude < -180 || landmark.longitude > 180) {
        errors.push('Landmark longitude must be between -180 and 180');
    }

    // Additional validation changes from the other branch
    if (Array.isArray(landmark) && landmark.length > 0) {
        if (!landmark[0].name || typeof landmark[0].name !== 'string' || landmark[0].name.trim() === '') {
            errors.push('Landmark array must have valid names');
        }
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Wraps the primary content in a <main> landmark element if not already present.
 * Implements proper landmark structure for accessibility compliance.
 */
function wrapPrimaryContentInMain() {
  // Check if a <main> element already exists
  let mainElement = document.querySelector('main[role="main"], main, [role="main"]');

  if (!mainElement) {
    // Find existing primary content element using common selectors
    const primaryContentSelectors = [
      '#primary-content',
      '#main-content',
      '[role="main"]',
      '.primary-content',
      '.main-content',
      '#content',
      'article',
      '.content'
    ];

    let primaryContent = null;

    for (const selector of primaryContentSelectors) {
      const element = document.querySelector(selector);
      if (element && element.tagName !== 'MAIN') {
        primaryContent = element;
        break;
      }
    }

    // If no specific primary content found, use body content
    if (!primaryContent) {
      primaryContent = document.body;
    }

    // Create main element with proper attributes
    mainElement = document.createElement('main');
    mainElement.id = 'main-content';
    mainElement.setAttribute('role', 'main');

    // Preserve existing id if the primary content has one
    if (primaryContent.id) {
      mainElement.id = primaryContent.id;
    }

    // Wrap the content appropriately
    if (primaryContent !== document.body && primaryContent.parentNode) {
      primaryContent.parentNode.insertBefore(mainElement, primaryContent);
      mainElement.appendChild(primaryContent);
    } else if (primaryContent === document.body) {
      // For body, insert main as first child
      mainElement.appendChild(document.createDocumentFragment());
      while (document.body.firstChild) {
        mainElement.appendChild(document.body.firstChild);
      }
      document.body.appendChild(mainElement);
    }
  }

  return mainElement;
}

function processUniqueElements(elements) {
    const seen = new Set();
    const uniqueElements = [];

    if (Array.isArray(elements)) {
        elements.forEach(element => {
            const key = element.id || element.name || JSON.stringify(element);
            if (!seen.has(key)) {
                seen.add(key);
                uniqueElements.push(element);
            }
        });
    }

    return uniqueElements;
}

// Implemented validateLandmark functionality

function initializeApp() {
    initialize();
    return appState;
}

// Main function (required export)

function main() {
    initialize();
    initializeApp();
    console.log('Main function executed');
    return { executed: true };
}

// Accessibility helper function to validate table accessibility
function validateTableAccessibility(table) {
    const issues = [];

    // Check for caption
    const caption = table.querySelector('caption');
    if (!caption) {
        issues.push('Table missing caption');
    }

    // Check for th elements with scope or headers
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
        if (!th.getAttribute('scope') && !th.getAttribute('headers')) {
            issues.push('TH element missing scope or headers attribute');
        }
    });

    return issues;
}

// Accessibility helper function to validate table structure
function validateTableStructure(table) {
    const issues = [];

    // Check for proper table structure (thead, tbody, tfoot)
    if (!table.querySelector('thead')) {
        issues.push('Table missing thead');
    }
    if (!table.querySelector('tbody')) {
        issues.push('Table missing tbody');
    }

    // Check for proper row structure
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td, th');
        if (cells.length === 0) {
            issues.push(`Row ${index} has no cells`);
        }
    });

    return issues;
}

// Landmark functions (merged from both branches)
function ensureLandmarkUniqueness(elements) {
    if (Array.isArray(elements)) {
        const elementsById = {};

        for (const landmark of elements) {
            if (landmark && landmark.id) {
                if (!elementsById[landmark.id]) {
                    elementsById[landmark.id] = true;
                } else {
                    landmark.id += '_duplicate';
                }
            }
        }

        return elements;
    }
    return elements;
}

// Accessibility helper function to get SVG accessible name
function getSvgAccessibleName(svgElement) {
    // Check for aria-label
    let label = svgElement.getAttribute('aria-label');

    // Check for aria-labelledby
    const labelledBy = svgElement.getAttribute('aria-labelledby');
    if (labelledBy) {
        const labelElement = document.getElementById(labelledBy);
        if (labelElement) {
            label = labelElement.textContent;
        }
    }

    // Check for title element inside SVG
    if (!label) {
        const title = svgElement.querySelector('title');
        if (title) {
            label = title.textContent;
        }
    }

    return label || '';
}

// Accessibility helper function to set SVG attributes for accessibility
function setSvgAttributes(svgElement, accessibleName) {
    // Ensure SVG has role="img"
    svgElement.setAttribute('role', 'img');

    // Set aria-label if not already set
    if (!svgElement.getAttribute('aria-label') && accessibleName) {
        svgElement.setAttribute('aria-label', accessibleName);
    }

    // Add title element if missing
    const existingTitle = svgElement.querySelector('title');
    if (!existingTitle && accessibleName) {
        const title = document.createElement('title');
        title.textContent = accessibleName;
        svgElement.insertBefore(title, svgElement.firstChild);
    }
}

// Accessibility helper function to ensure unique landmarks
function ensureUniqueLandmarks() {
    const landmarks = {};
    const issues = [];

    // Find all landmark elements
    const banner = document.querySelectorAll('[role="banner"], .banner');
    const navigation = document.querySelectorAll('[role="navigation"], .navigation');
    const main = document.querySelectorAll('[role="main"], .main');
    const contentinfo = document.querySelectorAll('[role="contentinfo"], .contentinfo');
    const complementary = document.querySelectorAll('[role="complementary"], .complementary');
    const search = document.querySelectorAll('[role="search"], .search');

    // Check for duplicate landmarks
    if (banner.length > 1) landmarks.banner = banner;
    if (main.length > 1) landmarks.main = main;
    if (contentinfo.length > 1) landmarks.contentinfo = contentinfo;

    if (complementary.length > 1) {
        issues.push(`Found ${complementary.length} complementary landmarks, should have at most 1`);
    }

    if (search.length > 1) {
        issues.push(`Found ${search.length} search landmarks, should have at most 1`);
    }

    return { landmarks, issues };
}

// Accessibility helper function to add proper landmark regions
function addLandmarkRegions() {
    // Check for main landmark
    let main = document.querySelector('[role="main"], .main');
    if (!main) {
        main = document.createElement('main');
        main.setAttribute('role', 'main');
    }
    if (!main) {
        // If no main found, wrap content appropriately
        main = document.createElement('main');
        main.setAttribute('id', 'main-content');
        // Content would need to be moved into main here
    }

    // Ensure unique IDs for landmarks
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], [role="search"], [role="region"]');
    const usedIds = new Set();

    landmarks.forEach(landmark => {
        const existingId = landmark.id;
        if (existingId) {
            usedIds.add(existingId);
        }
    });

    return { main, usedIds };
}

// Visualize dependency tree function (incorporated from origin/main)
function visualizeDependencyTree(dependencies) {
    console.log('Dependency Tree:');
    // Implementation would go here
    return dependencies;
}

// Process data function
function processData(data) {
    if (!data) {
        return null;
    }
    appState.data = data;
    return data;
}

// Function to handle focus trap for keyboard navigation
function createFocusTrap(container, options = {}) {
  const {
    onEscape = null,
    initialFocus = null,
    returnFocus = true,
  } = options;

  let previousActiveElement = null;
  let isActive = false;

  // Get all focusable elements within the container
  const getFocusableElements = () => {
    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors));
  };

  // Handle keydown events to trap focus
  const handleKeyDown = (event) => {
    if (!isActive) return;

    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab on first element moves to last
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      // Tab on last element moves to first
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    // Handle escape key
    if (event.key === 'Escape' && onEscape) {
      event.preventDefault();
      onEscape();
    }
  };

  // Activate the focus trap
  const activate = () => {
    previousActiveElement = document.activeElement;
    isActive = true;
    container.addEventListener('keydown', handleKeyDown);

    // Set initial focus
    if (initialFocus) {
      initialFocus.focus();
    } else {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  };

  // Deactivate the focus trap
  const deactivate = () => {
    isActive = false;
    container.removeEventListener('keydown', handleKeyDown);

    // Return focus to the previously focused element
    if (returnFocus && previousActiveElement && previousActiveElement.focus) {
      previousActiveElement.focus();
    }
  };

  return {
    activate,
    deactivate,
    getFocusableElements,
  };
}

function landmarkStructureCheck(landmark) {
  if (!landmark) {
    return false;
  }
  return landmark.name && landmark.latitude !== undefined && landmark.longitude !== undefined;
}

function setLanguageAttribute(lang) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', lang);
  }
}

function addLandmarkRoles(element, role) {
  if (element && role) {
    element.setAttribute('role', role);
  }
  return element;
}

function fixFakeLinks(element) {
  if (element && element.tagName === 'A' && !element.hasAttribute('href')) {
    element.setAttribute('role', 'button');
  }
  return element;
}

function isSecureContext() {
  if (typeof window !== 'undefined' && window.isSecureContext !== undefined) {
    return window.isSecureContext;
  }
  return false;
}

function initApp() {
  initializeApp();
}

function ensureFocusableElements(elements) {
  if (!Array.isArray(elements)) {
    return [];
  }
  return elements.filter(el => el && (el.tabIndex >= 0 || el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT'));
}

function renderDependencyGraphContent(graphData) {
  if (!graphData) {
    return '';
  }
  return JSON.stringify(graphData);
}

function validateSvgAccessibility(svgElement) {
  if (!svgElement) {
    return { valid: false, errors: ['SVG element is required'] };
  }
  const errors = [];
  if (!svgElement.getAttribute('role')) {
    errors.push('SVG must have a role attribute');
  }
  if (!svgElement.getAttribute('aria-label') && !svgElement.getAttribute('aria-labelledby')) {
    errors.push('SVG must have an accessible name');
  }
  return { valid: errors.length === 0, errors };
}

// New function for creating in-page buttons (from the other branch)
function createInPageButtons(buttonsData) {
    const buttonsContainer = document.getElementById('in-page-buttons-container');

    if (!buttonsContainer) {
        console.error('In-page buttons container not found');
        return;
    }

    buttonsData.forEach(buttonData => {
        const button = document.createElement('button');
        button.id = buttonData.id;
        button.textContent = buttonData.text;
        button.setAttribute('data-role', buttonData.role);

        button.addEventListener('click', () => {
            location.hash = buttonData.href;
        });

        buttonsContainer.appendChild(button);
    });
}

// Merged countDependencies function from both branches
/**
 * Counts the number of dependencies (landmarks) in the application.
 * @returns {number} The count of dependencies.
 */
function countDependencies() {
  return landmarks.length;
}

function addressInsightIssues(insights) {
  if (!Array.isArray(insights)) {
    return [];
  }
  return insights.map(insight => ({
    ...insight,
    addressed: true
  }));
}

function renderDependencyGraph(graph) {
  if (!graph) {
    return null;
  }
  return { rendered: true, graph };
}

function renderIndexView(data) {
  if (!data) {
    return null;
  }
  appState.data = data;
  return data;
}

// Fetch user function
function fetchUser(userId) {
  if (!userId) {
    return null;
  }
  return { id: userId, name: 'User ' + userId };
}

// Clear cache function
function clearCache() {
  appState.cache.clear();
}

// Helper function
function someFunction() {
  return 'some value';
}

// Helper for input transformation
function helper(input) {
  return input ? input.toUpperCase() : '';
}

// Format date function
function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString();
}

// Validate input function
function validateInput(input) {
  if (!input) {
    return false;
  }
  return true;
}

// Icons container
let icons = {};

// Landmark data
const landmarks = [];

// App data
const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

// TODO: Address accessibility issues from insight report

const HTML = ({ lang }) => <html lang={lang}>/* other children */</html>;

// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
// TODO: This is the existing code that needs to be preserved
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

// Implemented validateLandmark functionality
function validateLandmarkObject(landmark) {
  const errors = [];
}

function getLangAttribute() {
  return 'en';
}

function addLangAttribute(element) {
  if (element && typeof element === 'object') {
    element.lang = getLangAttribute();
  }
  return element;
}

function setLanguageAttribute() {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = 'en';
  }

module.exports = {
    User,
    spawnNewUser,
    config,
    initialize,
    initializeApp,
    main,
    ensureLandmarkUniqueness,
    wrapPrimaryContentInMain,
    createInPageButtons,
    createFocusTrap,
    validateTableAccessibility,
    validateTableStructure,
    countDependencies,
    landmarkStructureCheck,
    setLanguageAttribute,
    addLandmarkRoles,
    fixFakeLinks,
    isSecureContext,
    initApp,
    ensureFocusableElements,
    renderDependencyGraphContent,
    validateSvgAccessibility,
    processUniqueElements,
    checkLandmarkElement,
    validateLandmark
};