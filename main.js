import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

let icons = {};

// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

// Implemented validateLandmark functionality
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
  } else if (typeof landmark.longitude !== 'number' || ... {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  // Additional validation changes from the other branch
  if (Array.isArray(landmark) && landmark.length > 0) {
    if (!landmark[0].name || typeof landmark[0].name !== 'string' || landmark[0].name.trim() === '') {
      errors.push('Landmark array must have a name');
    }
}

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = ...
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
      return {};
  }
  const seen = new Set();
  return landmarksArray.filter(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    // Merge both approaches for checking uniqueness
    if (seen.has(key)) {
        return false;
    }
    seen.add(key);
    return true;
  });
}

// ... (previous and updated code remains as it is)

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if ... {
          ... = true;
        } else {
          landmark.id += '_duplicate';
        }
      }
    }
  }

  return elements;
}

// New function to add lang attribute to HTML element
function addLangAttribute(lang = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
}

// New function to fix table structure issues
function fixTableStructure(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  // Ensure table has proper structure
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    if (cells.length === 0) {
      row.remove();
    }
  });

  // Add proper headers if missing
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      const cells = firstRow.querySelectorAll('td');
      cells.forEach(cell => {
        cell.outerHTML = `<th>${cell.textContent}</th>`;
      });
    }
  }
}

// New function to validate table accessibility
function validateTableAccessibility(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return { valid: false, errors: ['Table not found'] };

  const errors = [];
  const rows = table.querySelectorAll('tr');

  // Check for proper headers
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    errors.push('Table missing header cells');
  }

  // Check row consistency
  const columnCount = headers.length;
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    if (cells.length !== columnCount) {
      errors.push('Inconsistent number of columns in table rows');
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

// New function to validate table structure
function validateTableStructure(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return { valid: false, errors: ['Table not found'] };

  const errors = [];
  const rows = table.querySelectorAll('tr');

  // Check for empty rows
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    if (cells.length === 0) {
      errors.push('Empty table row found');
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

// New function to add landmark roles
function addLandmarkRoles() {
  const landmarkRoles = {
    'main': 'main',
    'navigation': 'navigation',
    'search': 'search',
    'contentinfo': 'contentinfo',
    'complementary': 'complementary',
    'form': 'form',
    'region': 'region'
  };

  Object.entries(landmarkRoles).forEach(([id, role]) => {
    const element = document.getElementById(id);
    if (element) {
      element.setAttribute('role', role);
    }
  });
}

// New function to validate landmark structure
function validateLandmarkStructure() {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  const errors = [];

  landmarks.forEach(landmarkId => {
    const element = document.getElementById(landmarkId);
    if (!element) {
      errors.push(`Missing landmark element: ${landmarkId}`);
    } else if (!element.getAttribute('role')) {
      errors.push(`Landmark element ${landmarkId} missing role attribute`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

// New function to add accessible names to SVGs
function addSvgAccessibleName(svgId, name) {
  const svg = document.getElementById(svgId);
  if (svg) {
    svg.setAttribute('aria-label', name);
    svg.setAttribute('role', 'img');
  }
}

// New function to get SVG accessible name
function getSvgAccessibleName(svgId) {
  const svg = document.getElementById(svgId);
  if (svg) {
    return svg.getAttribute('aria-label') || '';
  }
  return '';
}

// New function to fix fake link issues
function fixFakeLinkIssue(linkId) {
  const link = document.getElementById(linkId);
  if (link && !link.getAttribute('href')) {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  }
}

// New function to create in-page button
function createInPageButton(id, text, onClick) {
  const button = document.createElement('button');
  button.id = id;
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}

// New function to address insight issues
function addressInsightIssues() {
  // Add lang attribute
  addLangAttribute();

  // Fix table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    fixTableStructure(table.id);
  });

  // Add landmark roles
  addLandmarkRoles();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    addSvgAccessibleName(svg.id, `SVG ${index + 1}`);
  });

  // Fix fake links
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    fixFakeLinkIssue(link.id);
  });
}

// Updated function using the new functions for rendering graph/index
function renderDependencyGraphContent() {
  const container = ...
  if (!container) {
    return;
  }
  
  // Address accessibility: Ensure the dependencyGraph container has a proper ARIA role
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'Dependency Graph');
  
  // Use the new functions for rendering
  renderDependencyGraph(container);
  renderIndexView(container);
}

<<<<<<< HEAD
// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// New functions to address accessibility issues

/**
 * Gets the appropriate lang attribute for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  // Default to English if no language is specified
  return document.documentElement.lang || 'en';
}

/**
 * Creates an in-page button with proper accessibility attributes
 * @param {string} text - Button text
 * @param {string} id - Button ID
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(text, id) {
  const button = document.createElement('button');
  button.textContent = text;
  button.id = id;
  button.setAttribute('aria-label', text);
  button.setAttribute('role', 'button');
  return button;
}

/**
 * Validates table accessibility according to WCAG standards
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
function validateTableAccessibility(table) {
  // Check for proper table structure
  if (!table.querySelector('thead') || !table.querySelector('tbody')) {
    return false;
  }

  // Check for proper scope attributes
  const headers = table.querySelectorAll('th');
  for (const header of headers) {
    if (!header.hasAttribute('scope')) {
      return false;
    }
  }

  return true;
}

/**
 * Validates table structure according to HTML standards
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table structure is valid
 */
function validateTableStructure(table) {
  // Check for proper table structure
  if (!table.querySelector('thead') || !table.querySelector('tbody')) {
    return false;
  }

  // Check for proper row and cell structure
  const rows = table.querySelectorAll('tr');
  for (const row of rows) {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      return false;
    }
  }

  return true;
}

/**
 * Gets an accessible name for an SVG element
 * @param {HTMLElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  // Check for aria-label first
  if (svg.hasAttribute('aria-label')) {
    return svg.getAttribute('aria-label');
  }

  // Then check for aria-labelledby
  if (svg.hasAttribute('aria-labelledby')) {
    const labelId = svg.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(labelId);
    if (labelElement) {
      return labelElement.textContent;
    }
  }

  // Fall back to title element
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent;
  }

  // If no accessible name found, return empty string
  return '';
}

/**
 * Sets proper attributes for SVG accessibility
 * @param {HTMLElement} svg - The SVG element
 * @param {string} name - The accessible name
 */
function setSvgAttributes(svg, name) {
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', name);
}

/**
 * Validates link accessibility according to WCAG standards
 * @param {HTMLElement} link - The link element to validate
 * @returns {boolean} True if link is accessible
 */
function validateLinkAccessibility(link) {
  // Check for proper link text
  if (!link.textContent || link.textContent.trim() === '') {
    return false;
  }

  // Check for proper href attribute
  if (!link.hasAttribute('href') || link.getAttribute('href') === '#') {
    return false;
  }

  return true;
}

/**
 * Handles fake links by converting them to proper buttons
 * @param {HTMLElement} link - The fake link element
 */
function handleFakeLinks(link) {
  const button = document.createElement('button');
  button.textContent = link.textContent;
  button.className = link.className;
  button.setAttribute('aria-label', link.textContent);

  // Copy all event listeners from the link
  const clone = link.cloneNode(true);
  const listeners = getEventListeners(link);
  for (const type in listeners) {
    for (const listener of listeners[type]) {
      button.addEventListener(type, listener.listener);
    }
  }

  // Replace the link with the button
  link.parentNode.replaceChild(button, link);
}

/**
 * Adds proper landmark regions to the document
 */
function addProperLandmarkRegions() {
  // Ensure main landmark exists
  if (!document.querySelector('[role="main"]')) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    document.body.prepend(main);
  }

  // Ensure navigation landmark exists
  if (!document.querySelector('[role="navigation"]')) {
    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    document.body.prepend(nav);
  }

  // Ensure contentinfo landmark exists
  if (!document.querySelector('[role="contentinfo"]')) {
    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    document.body.append(footer);
  }
}

=======
// Function to count dependencies
function countDependencies() {
  const dependencies = {
    'react': true,
    'react-redux': true,
    'antd': true
  };
  return Object.keys(dependencies).length;
}

// Add lang attribute to HTML element
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Fix table structure issues
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has proper caption if needed
    if (!table.querySelector('caption') && table.rows.length > 0) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table data';
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure table has proper headers
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      // Add headers if missing
      const firstRow = table.rows[0];
      if (firstRow) {
        Array.from(firstRow.cells).forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          cell.replaceWith(th);
        });
      }
    }

    // Ensure table has proper scope attributes for headers
    const headerRows = table.querySelectorAll('thead th');
    headerRows.forEach((th, index) => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

// Add/fix landmark issues
function addMainLandmark() {
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    main.id = 'main-content';
    document.body.appendChild(main);
  }
}

// Add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-hidden="true"])');
  svgs.forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        svg.setAttribute('aria-labelledby', title.id);
      } else {
        svg.setAttribute('aria-label', 'graphic');
      }
    }
  });
}

// Fix fake link issue
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('[role="link"][href="javascript:void(0)"]');
  fakeLinks.forEach(link => {
    link.setAttribute('tabindex', '0');
    link.setAttribute('role', 'button');
    link.removeAttribute('href');
  });
}

// Address all accessibility issues from insight report
function addressInsightIssues() {
  addLangAttribute();
  fixTableStructureIssues();
  addMainLandmark();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
}

// Initialize the app with accessibility fixes
function initApp() {
  initializeApp();
  addressInsightIssues();
  registerSW();
}

>>>>>>> origin/main
// Export functions for testing
export {
  checkLandmarkElement,
  ensureUniqueLandmarks,
  landmarkStructureCheck,
  setLanguageAttribute,
  addLandmarkRoles,
  fixFakeLinks,
  isSecureContext,
  initApp,
  landmarks,
  appData,
  icons,
  validateLandmark,
  ensureFocusableElements,
  renderDependencyGraphContent,
  ensureLandmarkUniqueness,
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  countDependencies,
=======
// Function to count dependencies
function countDependencies() {
  const dependencies = {
    'react': true,
    'react-redux': true,
    'antd': true
  };
  return Object.keys(dependencies).length;
}

// Add lang attribute to HTML element
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Fix table structure issues
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has proper caption if needed
    if (!table.querySelector('caption') && table.rows.length > 0) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table data';
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure table has proper headers
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      // Add headers if missing
      const firstRow = table.rows[0];
      if (firstRow) {
        Array.from(firstRow.cells).forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          cell.replaceWith(th);
        });
      }
    }

    // Ensure table has proper scope attributes for headers
    const headerRows = table.querySelectorAll('thead th');
    headerRows.forEach((th, index) => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

// Add/fix landmark issues
function addMainLandmark() {
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    main.id = 'main-content';
    document.body.appendChild(main);
  }
}

// Add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-hidden="true"])');
  svgs.forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        svg.setAttribute('aria-labelledby', title.id);
      } else {
        svg.setAttribute('aria-label', 'graphic');
      }
    }
  });
}

// Fix fake link issue
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('[role="link"][href="javascript:void(0)"]');
  fakeLinks.forEach(link => {
    link.setAttribute('tabindex', '0');
    link.setAttribute('role', 'button');
    link.removeAttribute('href');
  });
}

// Address all accessibility issues from insight report
function addressInsightIssues() {
  addLangAttribute();
  fixTableStructureIssues();
  addMainLandmark();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
}

// Initialize the app with accessibility fixes
function initApp() {
  initializeApp();
  addressInsightIssues();
  registerSW();
}

>>>>>>> origin/main
};