import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

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
// (This comment remains as-is)
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
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
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

  // Check for updated validation changes from another branch that also checks for array composition
  if (Array.isArray(landmark)) {
    landmark.forEach(innerLandmark => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push('Landmark array must have valid names');
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
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

// New function for creating in-page buttons
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

// ... (previous and updated code remains as it is)

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (!elementsById[landmark.id]) {
          elementsById[landmark.id] = true;
        } else {
          landmark.id += '_duplicate';
        }
      }
    }
  }

  return elements;
}

// Updated function using the new functions for rendering graph/index
function renderDependencyGraphContent() {
  const container = document.getElementById('dependencyGraph');
  if (!container) {
    return;
  }

  // Use the new functions for rendering
  renderDependencyGraph(container);
  renderIndexView(container);
}

// Function to count dependencies
function countDependencies() {
  const dependencies = {
    'react': true,
    'react-redux': true,
    'antd': true
  };
  return Object.keys(dependencies).length;
}

// New function to get language attribute
function getLangAttribute() {
  return document.documentElement.getAttribute('lang') || 'en';
}

// New function to add language attribute
function addLangAttribute(lang = 'en') {
  document.documentElement.setAttribute('lang', lang);
}

// New function to validate table accessibility
function validateTableAccessibility(table) {
  if (!table) return false;

  // Check if table has a caption
  const hasCaption = table.querySelector('caption') !== null;

  // Check if table has proper headers
  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;

  // Check if table has proper scope attributes for headers
  let hasScope = true;
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      hasScope = false;
    }
  });

  return hasCaption && hasHeaders && hasScope;
}

// New function to validate table structure
function validateTableStructure(table) {
  if (!table) return false;

  // Check if table has proper row structure
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) return false;

  // Check if first row has th elements (header row)
  const firstRow = rows[0];
  const headerCells = firstRow.querySelectorAll('th');
  if (headerCells.length === 0) return false;

  // Check if all rows have proper cell count
  const cellCount = headerCells.length;
  let isValid = true;
  rows.forEach(row => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length !== cellCount) {
      isValid = false;
    }
  });

  return isValid;
}

// New function to fix table structure
function fixTableStructure(table) {
  if (!table) return;

  // Add caption if missing
  if (!table.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Table caption';
    table.prepend(caption);
  }

  // Add scope to headers if missing
  const headers = table.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });

  // Ensure all rows have proper cell count
  const rows = table.querySelectorAll('tr');
  if (rows.length > 0) {
    const firstRow = rows[0];
    const headerCells = firstRow.querySelectorAll('th');
    const cellCount = headerCells.length;

    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length < cellCount) {
        // Add missing cells
        const missingCount = cellCount - cells.length;
        for (let i = 0; i < missingCount; i++) {
          const newCell = document.createElement('td');
          newCell.textContent = ' ';
          row.appendChild(newCell);
        }
      }
    });
  }
}

// New function to add main landmark
function addMainLandmark() {
  const mainElement = document.querySelector('main');
  if (!mainElement) {
    const newMain = document.createElement('main');
    newMain.setAttribute('role', 'main');
    document.body.prepend(newMain);
  } else if (!mainElement.hasAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }
}

// New function to validate landmark structure
function validateLandmarkStructure() {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  const errors = [];

  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    if (elements.length > 1) {
      errors.push(`Multiple ${landmark} landmarks found`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

// New function to get SVG accessible name
function getSvgAccessibleName(svg) {
  if (!svg) return '';

  // Check for title element
  const title = svg.querySelector('title');
  if (title) return title.textContent.trim();

  // Check for aria-label
  if (svg.hasAttribute('aria-label')) {
    return svg.getAttribute('aria-label').trim();
  }

  // Check for aria-labelledby
  if (svg.hasAttribute('aria-labelledby')) {
    const id = svg.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(id);
    if (labelElement) return labelElement.textContent.trim();
  }

  return '';
}

// New function to set SVG attributes
function setSvgAttributes(svg, name) {
  if (!svg || !name) return;

  // Set aria-label if not already set
  if (!svg.hasAttribute('aria-label')) {
    svg.setAttribute('aria-label', name);
  }

  // Add title element if not present
  if (!svg.querySelector('title')) {
    const title = document.createElement('title');
    title.textContent = name;
    svg.prepend(title);
  }
}

// New function to validate link accessibility
function validateLinkAccessibility(link) {
  if (!link) return false;

  // Check if link has text content
  const hasText = link.textContent.trim().length > 0;

  // Check if link has aria-label if it's an icon-only link
  const hasAriaLabel = link.hasAttribute('aria-label') && link.getAttribute('aria-label').trim().length > 0;

  // Check if link has proper href
  const hasHref = link.hasAttribute('href') && link.getAttribute('href').trim().length > 0;

  return (hasText || hasAriaLabel) && hasHref;
}

// New function to handle fake links
function handleFakeLinks() {
  const links = document.querySelectorAll('a[href="#"]');

  links.forEach(link => {
    // If link has no click handler, make it a button
    if (!link.onclick && !link.hasAttribute('onclick')) {
      const button = document.createElement('button');
      button.textContent = link.textContent;
      button.className = link.className;
      link.replaceWith(button);
    }
  });
}

// New function to add proper landmark regions
function addProperLandmarkRegions() {
  // Add main landmark if missing
  addMainLandmark();

  // Add navigation landmark if missing
  const navElement = document.querySelector('nav');
  if (!navElement) {
    const newNav = document.createElement('nav');
    newNav.setAttribute('role', 'navigation');
    document.body.prepend(newNav);
  } else if (!navElement.hasAttribute('role')) {
    navElement.setAttribute('role', 'navigation');
  }

  // Add contentinfo landmark if missing
  const footerElement = document.querySelector('footer');
  if (!footerElement) {
    const newFooter = document.createElement('footer');
    newFooter.setAttribute('role', 'contentinfo');
    document.body.appendChild(newFooter);
  } else if (!footerElement.hasAttribute('role')) {
    footerElement.setAttribute('role', 'contentinfo');
  }
}

// New function to address all insight issues
function addressInsightIssues() {
  // Add lang attribute
  addLangAttribute();

  // Fix table issues
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!validateTableAccessibility(table) || !validateTableStructure(table)) {
      fixTableStructure(table);
    }
  });

  // Add/fix landmarks
  addProperLandmarkRegions();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const name = getSvgAccessibleName(svg);
    if (!name) {
      setSvgAttributes(svg, 'Graphic element');
    }
  });

  // Fix fake links
  handleFakeLinks();
}

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
  createInPageButtons, // Added new export
  getLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks
};