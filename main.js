// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// TODO: Import required modules and export the new necessary functions here in main.js (preserving the original code)

const { createInPageButton, createWebResourceButton, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, getLangAttribute, validateAccessibilityReport } = require('./utilities');
const main = require('./utilities');

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  maxRetries: 3,
  timeout: 5000
};

// Accessibility utilities and functions
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.querySelector('a.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  },

  // Trap focus within an element (for modals, dialogs)
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  },

  // Announce message to screen readers
  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  },

  // Handle keyboard navigation
  handleKeyboardNav: (e, handlers) => {
    const key = e.key;
    if (handlers[key]) {
      handlers[key](e);
    }
  }
};

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(`[${level.toUpperCase()}] ${timestamp}: ${message}`);
}

function validateInput(input) {
  if (typeof input !== 'string') {
    return false;
  }
  return input.length > 0 && input.length <= 1000;
}

function sanitizeInput(input) {
  try {
    return input.replace(/[^a-zA-Z0-9\s-]/g, '');
  } catch (error) {
    return null;
  }
}

function formatResponse(data, statusCode = 200) {
  return {
    statusCode,
    data,
    timestamp: new Date().toISOString()
  };
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryOperation(operation, maxRetries = CONFIG.maxRetries) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      log(`Attempt ${i + 1} failed: ${error.message}`, 'warn');
      if (i < maxRetries - 1) {
        await delay(1000 * (i + 1));
      }
    }
  }
  throw lastError;
}

function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error');
    return null;
  }
}

// Existing data processing functions
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

function filterValidItems(items, validator) {
  return items.filter(item => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

function groupItemsByCategory(items, getCategory) {
  return items.reduce((groups, item) => {
    const category = getCategory(item);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

// New function added as per issue
function myNewFunction(input) {
  if (typeof input !== 'string') {
    return input;
  }
  return input.toUpperCase();
}

// Calculate sum of numbers array
function calculateSum(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
}

// Additional utility functions for accessibility
function addMainLandmark() {
  // Implementation for REACT_017: Add landmark issues
  const existingMain = document.querySelector('main');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(mainElement, body.firstChild);
    } else {
      body.appendChild(mainElement);
    }
    return mainElement;
  }
  return existingMain;
}

function ensureUniqueLandmarks() {
  // Implementation for REACT_025: Ensure unique landmarks
  const landmarks = document.querySelectorAll(
    'header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]'
  );

  const landmarkTypes = {};
  let fixedCount = 0;

  landmarks.forEach((landmark) => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role');
    const identifier = role || tagName;

    if (!landmarkTypes[identifier]) {
      landmarkTypes[identifier] = 0;
    } else {
      landmarkTypes[identifier]++;
      if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
        landmark.setAttribute('aria-label', `${identifier} ${landmarkTypes[identifier] + 1}`);
        fixedCount++;
      }
    }
  });

  return fixedCount;
}

function addAltAttribute() {
  // Implementation for adding alt attributes
  const images = document.querySelectorAll('img:not([alt])');
  let addedCount = 0;

  images.forEach((img) => {
    const src = img.getAttribute('src') || '';
    const filename = src.split('/').pop() || 'image';
    img.setAttribute('alt', filename);
    addedCount++;
  });

  return addedCount;
}

function replaceButtonId() {
  // Implementation for replacing button id
  const buttons = document.querySelectorAll('button:not([id])');
  let fixedCount = 0;

  buttons.forEach((button, index) => {
    const existingText = button.textContent.trim();
    const id = `button-${index + 1}-${Date.now()}`;
    button.id = id;
    fixedCount++;
  });

  return fixedCount;
}

function addLangAttribute() {
  // Implementation for adding lang attribute
  const html = document.querySelector('html');
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
    return true;
  }
  return false;
}

function fixTableStructure() {
  // Implementation for fixing table structure
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;

  tables.forEach((table) => {
    let fixed = false;

    // Add caption if missing
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table';
      table.insertBefore(caption, table.firstChild);
      fixed = true;
    }

    // Ensure thead exists
    if (!table.querySelector('thead')) {
      const rows = table.querySelectorAll('tr');
      if (rows.length > 0) {
        const thead = document.createElement('thead');
        thead.appendChild(rows[0]);
        table.insertBefore(thead, table.firstChild);
        fixed = true;

        // Add scope to header cells
        const headerCells = thead.querySelectorAll('th');
        headerCells.forEach((cell) => {
          if (!cell.hasAttribute('scope')) {
            cell.setAttribute('scope', 'col');
          }
        });
      }
    }

    if (fixed) fixedCount++;
  });

  return fixedCount;
}

function addSvgAccessibleName() {
  // Implementation for adding SVG accessible name
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  let addedCount = 0;

  svgs.forEach((svg, index) => {
    const title = svg.querySelector('title');
    if (title) {
      const titleId = `svg-title-${index}-${Date.now()}`;
      title.id = titleId;
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', titleId);
      addedCount++;
    } else {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', `Image ${index + 1}`);
      addedCount++;
    }
  });

  return addedCount;
}

function fixFakeLinkIssue() {
  // Implementation for fixing fake link issues
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a), span[onclick], div[onclick]');
  let fixedCount = 0;

  fakeLinks.forEach((element) => {
    const onclick = element.getAttribute('onclick');
    const text = element.textContent.trim();

    if (onclick) {
      const anchor = document.createElement('a');
      anchor.setAttribute('href', '#');
      anchor.setAttribute('onclick', `${onclick}; return false;`);
      anchor.textContent = text;

      // Copy accessibility attributes
      const ariaLabel = element.getAttribute('aria-label');
      if (ariaLabel) {
        anchor.setAttribute('aria-label', ariaLabel);
      }

      element.parentNode.replaceChild(anchor, element);
      fixedCount++;
    }
  });

  return fixedCount;
}

function addAriaAttribute() {
  // Implementation for adding aria attributes
  const elements = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby]), select:not([aria-label]):not([aria-labelledby]), textarea:not([aria-label]):not([aria-labelledby])');
  let addedCount = 0;

  elements.forEach((element) => {
    const placeholder = element.getAttribute('placeholder');
    const id = element.id;
    const label = document.querySelector(`label[for="${id}"]`);

    if (placeholder) {
      element.setAttribute('aria-label', placeholder);
      addedCount++;
    } else if (label) {
      element.setAttribute('aria-label', label.textContent.trim());
      addedCount++;
    }
  });

  return addedCount;
}

/**
 * Ensures the element has an id. If the element doesn't have an id,
 * generates one and assigns it to the element.
 * @param {HTMLElement} element - The element to check and modify
 * @param {string} [prefix='element'] - Prefix for the generated id
 * @returns {string} The element's id (existing or newly generated)
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const id = `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
  element.id = id;
  return id;
}

/**
 * Adds an aria-label attribute to the element if it doesn't already have one.
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The aria-label value to set
 * @returns {boolean} True if label was added, false if element already had one
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }

  if (!label) {
    throw new Error('Label is required');
  }

  if (element.getAttribute('aria-label')) {
    return false;
  }

  element.setAttribute('aria-label', label);
  return true;
}

/**
 * Renders dependency graphs for the given configuration.
 * @param {HTMLElement} container - The container element to render into
 * @param {Object} dependencies - The dependencies data to render
 * @param {Object} [options={}] - Optional rendering configuration
 * @returns {Object} The rendered graph instance
 */
function renderDependencyGraphs(container, dependencies, options = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }

  if (!dependencies) {
    throw new Error('Dependencies data is required');
  }

  // Ensure container has an id for graph references
  const containerId = ensureElementHasId(container, 'graph-container');

  // Add accessibility label if not present
  const hasAriaLabel = addAriaLabel(container, `Dependency graph: ${containerId}`);

  // Placeholder for graph rendering logic
  // Actual implementation would use a library like D3.js or similar
  const graphData = {
    id: containerId,
    dependencies: dependencies,
    options: options,
    rendered: true,
    timestamp: new Date().toISOString()
  };

  console.log('Rendering dependency graphs:', graphData);

  return graphData;
}

async function handleCredentialResponse(response) {
  if (!response) {
    throw new Error('No response received');
  }

  if (response.error) {
    throw new Error(response.error);
  }

  if (response.token) {
    return {
      success: true,
      token: response.token,
      expiresIn: response.expiresIn || 3600
    };
  }

  throw new Error('Invalid credential response');
}

// TODO: Implement a new function to handle focus trap for keyboard navigation
const focusTrap = (element) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  let activeElementIndex = focusableElements.length - 1;

  function setActiveElement(index) {
    if (index < 0) {
      index = focusableElements.length - 1;
    } else if (index >= focusableElements.length) {
      index = 0;
    }

    if (focusableElements[index]) {
      focusableElements[index].focus();
    } else {
      element.focus();
    }
    activeElementIndex = index;
  }

  function nextFocusableElement() {
    setActiveElement(activeElementIndex + 1);
  }

  function previousFocusableElement() {
    setActiveElement(activeElementIndex - 1);
  }

  function moveFocusToFirst() {
    setActiveElement(0);
  }

  function moveFocusToLast() {
    setActiveElement(focusableElements.length - 1);
  }

  element.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'Tab':
        if (e.shiftKey) {
          previousFocusableElement();
        } else {
          nextFocusableElement();
        }
        e.preventDefault();
        break;
      case 'ArrowLeft':
        previousFocusableElement();
        e.preventDefault();
        break;
      case 'ArrowRight':
        nextFocusableElement();
        e.preventDefault();
        break;
      case 'Home':
        moveFocusToFirst();
        e.preventDefault();
        break;
      case 'End':
        moveFocusToLast();
        e.preventDefault();
        break;
    }
  });
};

// TODO: Implement the function for addressing new accessibility issues
const addressAccessibilityIssues = (container) => {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  // Handle HTML lang attribute (REACT_001)
  if (typeof document !== 'undefined') {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      const langValue = htmlElement.getAttribute('lang') || 'en';
      if (!langValue || langValue === '') {
        htmlElement.setAttribute('lang', 'en');
        fixes.langAdded = true;
      }
    }
  }

  // Add main landmark if missing (REACT_017)
  if (container) {
    const existingMain = container.querySelector('main');
    if (!existingMain) {
      const mainElement = document.createElement('main');
      container.appendChild(mainElement);
      fixes.mainLandmarkAdded = true;
    }

    // Ensure unique landmarks (REACT_025)
    fixes.landmarksFixed = ensureUniqueLandmarks();

    // Add accessible names to SVGs (REACT_026)
    fixes.svgNamesAdded = addSvgAccessibleName();

    // Fix fake link issues (REACT_027)
    fixes.fakeLinksFixed = fixFakeLinkIssue();
  }

  return fixes;
};