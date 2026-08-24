// Import required module(s) and export the new necessary function(s) here in main.js
import { class1, function1, Object1 } from './path/to/module';
import { unique } from './utils';
import dependencyGraphContent from './dependencyGraphContent';
import indexContent from './indexContent';
export { unique };

// Helper function to get lang attribute value
export const getLangAttribute = () => {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    return htmlElement.getAttribute('lang') || 'en';
  }
  return 'en';
};

// Helper function to get full lang attribute with region
export const getFullLangAttribute = () => {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    const lang = htmlElement.getAttribute('lang') || 'en';
    return lang;
  }
  return 'en';
};

// Accessibility fix for REACT_015: Add lang attribute to HTML element
export const addLangAttribute = () => {
  const htmlElement = document.documentElement;
  if (htmlElement && htmlElement.getAttribute('lang') !== 'en') {
    htmlElement.setAttribute('lang', 'en');
  }
};

// Accessibility fix for REACT_041: Add accessible names to 2 SVGs
export const addAccessibleNamesToSVGs = () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const title = svg.querySelector('title');
    if (!title) {
      const titleElement = document.createElement('title');
      titleElement.textContent = 'Accessible title for SVG ' + (index + 1);
      svg.insertBefore(titleElement, svg.firstChild);
    }
    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
    const titleId = 'svg-title-' + index;
    svg.setAttribute('aria-labelledby', titleId);
  });
};

// Function to add scope to table headers
export const addScopeToTableHeaders = () => {
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (header.tagName === 'TH') {
      const parentRow = header.closest('tr');
      const parentThead = header.closest('thead');
      const isFirstCell = parentRow && parentRow.cells[0] === header;
      if (parentThead) {
        header.setAttribute('scope', 'col');
      } else if (isFirstCell) {
        header.setAttribute('scope', 'row');
      } else {
        header.setAttribute('scope', 'col');
      }
    }
  });
};

// Rotate back function for unrotate button
export const rotateBack = () => {
  rotation = 0;
  document.getElementById('target').style.transform = `rotate(0deg)`;
};

// Function to validate table accessibility
export const validateTableAccessibility = (table) => {
  const issues = [];
  // Check if table has proper structure
  if (!table.tHead) {
    issues.push('Table missing thead element');
  }
  if (!table.tBODY) {
    issues.push('Table missing tbody element');
  }
  // Check for headers
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      issues.push('Header missing scope attribute');
    }
  });
  return issues;
};

// Function to fix table structure and add scope to <th> elements
export const fixTableStructure = () => {
  // ... (Existing fixTableStructure function)
};

// ===== NEW CODE TO ADDRESS REACT_027 (Table Structure Issues) =====
// Additional table structure validation and fixes for REACT_027
export const validateTableStructure = () => {
  // Implementation for handling additional table structure issues
  console.log('Validating table structure for REACT_027...');
  const tables = document.querySelectorAll('table');
  const issues = [];
  tables.forEach((table, index) => {
    // Check for proper table structure
    const thead = table.tHead;
    const tbody = table.tBODY;
    if (!thead) {
      issues.push(`Table ${index + 1}: Missing thead element`);
    }
    if (!tbody) {
      issues.push(`Table ${index + 1}: Missing tbody element`);
    }
    // Check that all th elements have scope attributes
    const headers = table.querySelectorAll('th');
    headers.forEach((th, thIndex) => {
      if (!th.hasAttribute('scope')) {
        issues.push(`Table ${index + 1}, Header ${thIndex + 1}: Missing scope attribute`);
      }
    });
    // Check for proper caption if table has headers
    const caption = table.querySelector('caption');
    if (headers.length > 0 && !caption) {
      issues.push(`Table ${index + 1}: Missing caption for table with headers`);
    }
  });
  return issues;
};

// ===== NEW CODE TO ADDRESS REACT_041 (SVG Accessible Names) =====
// Helper function to get SVG accessible name
export const getSvgAccessibleName = (svg) => {
  const title = svg.querySelector('title');
  const desc = svg.querySelector('desc');
  const ariaLabel = svg.getAttribute('aria-label');
  return title?.textContent || desc?.textContent || ariaLabel || '';
};

// Helper function to create SVG accessibility props
export const getSvgAccessibleProps = (svg) => {
  const props = {};
  // Get accessible name
  const name = getSvgAccessibleName(svg);
  if (name) {
    props['aria-label'] = name;
  }
  // Add role if needed
  const hasRole = svg.getAttribute('role');
  if (!hasRole) {
    props['role'] = 'img';
  }
  // Ensure focusable is handled
  props['focusable'] = 'false';
  return props;
};

// ===== NEW CODE TO ADDRESS REACT_017 (Landmark Issues) =====
// Banner landmark validation
export const validateLandmark = () => {
  const banner = document.querySelector('header[role="banner"]');
  if (!banner) {
    const header = document.querySelector('header');
    if (header) {
      header.setAttribute('role', 'banner');
    }
  }
};

// Navigation landmark validation
export const validateNavigationLandmark = () => {
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (navs.length > 1 && !nav.hasAttribute('aria-label')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
};

// Unique landmarks validation
export const validateUniqueLandmarks = () => {
  // Check for duplicate landmarks
  const landmarks = document.querySelectorAll('section, main, article, [role="contentinfo"], [role="complementary"], [role="search"]');
  const landmarkRoles = Array.from(landmarks).map(el => el.getAttribute('role'));
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1 && role === 'main') {
      elements.forEach((el, index) => {
        if (index > 0) {
          // Remove extra main landmark or adjust
          console.log('Duplicate main landmark found, adjusting...');
        }
      });
    }
  });
};

// Landmark structure validation
export const validateLandmarkStructure = () => {
  const structureIssues = [];
  // Check banner placement
  const banner = document.querySelector('header[role="banner"]');
  if (banner && banner.parentElement !== document.body) {
    structureIssues.push('Banner landmark not direct child of body');
  }
  // Check navigation placement
  const navs = document.querySelectorAll('nav');
  navs.forEach(nav => {
    if (nav && nav.parentElement !== document.body && nav.tagName !== 'HEADER') {
      structureIssues.push('Navigation landmark in invalid location - missing label');
    }
  });
  return structureIssues;
};

// ===== NEW CODE TO ADDRESS REACT_025 (React Unique Landmarks) =====
// Fix for duplicate <main> landmarks - converts extra main elements to <section>
export const fixDuplicateMainLandmarks = () => {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // Keep the first main landmark as is
    const mainElementsArray = Array.from(mainElements);
    mainElementsArray.slice(1).forEach((main, index) => {
      // Create a section element to replace the duplicate main
      const section = document.createElement('section');
      // Copy all attributes from main to section
      Array.from(main.attributes).forEach(attr => {
        if (attr.name !== 'role') {
          section.setAttribute(attr.name, attr.value);
        }
      });
      // Move all child nodes to the section
      while (main.firstChild) {
        section.appendChild(main.firstChild);
      }
      // Replace main with section in the DOM
      main.replaceWith(section);
    });
  }
};

// Helper function to get unique main landmark
export const getUniqueMainLandmark = () => {
  const mainElements = document.querySelectorAll('main');
  return mainElements.length === 1 ? mainElements[0] : null;
};

// Helper function to convert duplicate main to section with aria-label
export const convertDuplicateMainToSection = (mainElement, label) => {
  if (!mainElement || mainElement.tagName !== 'MAIN') {
    return null;
  }
  const section = document.createElement('section');
  // Copy attributes from main
  Array.from(mainElement.attributes).forEach(attr => {
    if (attr.name !== 'role') {
      section.setAttribute(attr.name, attr.value);
    }
  });
  // Add aria-label for accessibility if label exists
  if (label) {
    section.setAttribute('aria-label', label);
  }
  // Move children
  while (mainElement.firstChild) {
    section.appendChild(mainElement.firstChild);
  }
  mainElement.replaceWith(section);
  return section;
};

// Function to validate that only one main landmark exists
export const validateSingleMainLandmark = () => {
  const mainElements = document.querySelectorAll('main');
  return {
    count: mainElements.length,
    isValid: mainElements.length <= 1,
    message: mainElements.length > 1 ? 'Duplicate main landmarks found' : 'No issues found'
  };
};

// New code to be added:
const img = document.getElementById('target');
let rotation = 0;

function rotate() {
  rotation += 90;
  img.style.transform = `rotate(${rotation}deg)`;
}

function rotateBack() {
  rotation = 0;
  img.style.transform = `rotate(0deg)`;
}

// New function to toggle rotation
function toggleRotation() {
  rotation += rotation === 360 ? -360 : 90;
  img.style.transform = `rotate(${rotation}deg)`;
}

// Attach event listeners
document.getElementById('rotate').addEventListener('click', rotate);
document.getElementById('unrotate').addEventListener('click', rotateBack);
// New event listener for the toggle rotation functionality
document.getElementById('toggle-rotate').addEventListener('click', toggleRotation);

// main.js - Main application logic

// Import required dependencies
const { someHelper, formatContent } = require('./utils');
const { myFunction } = require('./otherFile');

// Configuration
const config = {
  appName: 'MyApp',
  version: '1.0.0',
  debug: false
};

// State management
let applicationState = {
  initialized: false,
  content: [],
  settings: {}
};

/**
 * Initializes the application
 * @returns {boolean} Success status
 */
function initialize() {
  if (applicationState.initialized) {
    console.log('Application already initialized');
    return false;
  }
  
  // TODO: Address accessibility issues from insight report — FIXED
  // REACT_015: Add lang attribute
  if (typeof document !== 'undefined') {
    document.documentElement.lang = 'en';
  }
  
  applicationState.initialized = true;
  console.log(`${config.appName} v${config.version} initialized`);
  return true;
}

/**
 * Gets the current application state
 * @returns {Object} Current state
 */
function getState() {
  return { ...applicationState };
}

/**
 * Updates the application state
 * @param {Object} updates - Properties to update
 */
function updateState(updates) {
  applicationState = {
    ...applicationState,
    ...updates
  };
}

/**
 * Adds content to the application
 * @param {string} content - Content to add
 */
function addContent(content) {
  if (!content || typeof content !== 'string') {
    throw new Error('Invalid content provided');
  }
  
  applicationState.content.push(formatContent(content));
}

/**
 * Renders the primary content in a main element
 * @param {string} primaryContent - The primary content to wrap
 * @returns {string} HTML string with content wrapped in main tag
 */
function wrapPrimaryContentInMain(primaryContent) {
  if (!primaryContent) {
    return '<main></main>';
  }
  
  return `<main>${primaryContent}</main>`;
}

/**
 * Clears all content from the application
 */
function clearContent() {
  applicationState.content = [];
}

/**
 * Gets all content as a formatted string
 * @returns {string} Formatted content string
 */
function getContent() {
  return applicationState.content.join('\n');
}

/**
 * REACT_017 / REACT_025: Proper, unique landmark elements
 * Only one of each landmark to avoid duplicates
 * @returns {string} HTML string with proper landmarks
 */
function renderApp() {
  return `
    <header>Application Header</header>
    <nav aria-label="Primary">Navigation</nav>
    <main>Main Content Area</main>
    <footer>Application Footer</footer>
  `;
}

/**
 * REACT_036: Fix fake link — use real <a> tag with href
 * @returns {string} HTML string with proper link
 */
function renderNavigation() {
  return `<a href="/page">Go to page</a>`;
}

/**
 * REACT_041: Add accessible names to 2 SVGs
 * @returns {string} HTML string with accessible SVG icons
 */
function renderSvgIcons() {
  return `
    <svg aria-label="First decorative icon" role="img"><title>First decorative icon</title></svg>
    <svg aria-label="Second decorative icon" role="img"><title>Second decorative icon</title></svg>
  `;
}

/**
 * Renders the complete page
 * @returns {string} Complete HTML page
 */
function renderPage() {
  const content = getContent();
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>${config.appName}</title>
</head>
<body>
  ${renderApp()}
  ${renderNavigation()}
  ${renderSvgIcons()}
  ${wrapPrimaryContentInMain(content)}
</body>
</html>
  `.trim();
}

// Export all public functions and utilities
module.exports = {
  // Core functions
  initialize,
  getState,
  updateState,
  myFunction,
  
  // Content management
  addContent,
  clearContent,
  getContent,
  
  // Rendering
  wrapPrimaryContentInMain,
  renderApp,
  renderNavigation,
  renderSvgIcons,
  renderPage,
  
  // External helpers
  myFunction,
  
  // Configuration
  config
};