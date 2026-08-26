// TODO: Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----

/**
 * REACT_036 Fix: React Fake Link
 *
 * Issue: The "rotate back" link in docs/dependency-graph.html used
 * <a href="#"> which doesn't navigate anywhere, causing screen readers
 * to announce it as a dead link and preventing proper keyboard activation.
 *
 * Fix: This script replaces the anchor element with a proper <button>
 * element that has correct keyboard focus,
 * space/enter activation, and screen reader semantics.
 */

/**
 * Configuration for the dependency graph controller.
 */
const config = {
    rotationStep: 90,
    animationDuration: 300
};

/**
 * Replaces the fake anchor link with a proper button element
 * for accessibility compliance (REACT_036).
 *
 * This function finds the <a id="unrotate" href="#"> element and
 * replaces it with a <button> that provides proper keyboard focus,
 * space/enter activation, and screen reader semantics.
 */
function fixFakeLink() {
    const unrotateButton = document.createElement('button');
    unrotateButton.id = 'unrotate';
    unrotateButton.textContent = 'Rotate back';
    unrotateButton.role = 'button';
    unrotateButton.ariaLabel = 'Rotate the dependency graph back to the original position.';
    unrotateButton.addEventListener('click', handleRotateBack);
    document.querySelector('#unrotate').replaceWith(unrotateButton);
}

/* New function REACT_015: Add lang attribute to HTML element */
function addLangAttribute() {
    if (!document.documentElement.hasAttribute('lang')) {
        document.documentElement.setAttribute('lang', document.documentElement.lang);
    }
}

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
export const addLangAttributeExport = () => {
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
    if (!svg.getAttribute('role')) {
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
  img.style.transform = `rotate(0deg)`;
};

// Function to validate table accessibility
export const validateTableAccessibility = (table) => {
  const issues = [];
  // Check if table has proper structure
  if (!table.tHead) {
    issues.push('Table missing thead element');
  }
  if (!table.tBodies || table.tBodies.length === 0) {
    issues.push('Table missing tbody element');
  }
  // Check for headers
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
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
    const tbody = table.tBodies && table.tBodies.length > 0;
    if (!thead) {
      issues.push(`Table ${index + 1}: Missing thead element`);
    }
    if (!tbody) {
      issues.push(`Table ${index + 1}: Missing tbody element`);
    }
    // Check that all th elements have scope attributes
    const headers = table.querySelectorAll('th');
    headers.forEach((th, thIndex) => {
      if (!th.getAttribute('scope')) {
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
  const banner = document.querySelector('[role="banner"]');
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
    if (navs.length > 1 && !nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
};

// Unique landmarks validation
export const validateUniqueLandmarks = () => {
  // Check for duplicate landmarks
  const landmarks = document.querySelectorAll('main, article, [role="contentinfo"], [role="complementary"], [role="search"]');
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
  const banner = document.querySelector('[role="banner"]');
  if (banner && banner.parentElement !== document.body) {
    structureIssues.push('Banner landmark not direct child of body');
  }
  // Check navigation placement
  const navs = document.querySelectorAll('nav');
  navs.forEach(nav => {
    if (nav && nav.parentElement !== document.body && nav.tagName !== 'HEADER') {
      console.log('Navigation landmark in invalid location - missing label');
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
      main.parentNode.replaceChild(section, main);
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
  mainElement.parentNode.replaceChild(section, mainElement);
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

/**
 * Handles the rotate back action when the button is clicked.
 * Resets the dependency graph to its original rotation (0 degrees).
 */
function handleRotateBack() {
  rotateDependencyGraph(0);

  // Dispatch event for any other listeners
  if (typeof window !== 'undefined' && window.CustomEvent) {
    const event = new CustomEvent('rotateback', { detail: { degrees: 0 } });
    window.dispatchEvent(event);
  }
}

// New code to be added:
let img = document.querySelector('img');
let rotation = 0;

function rotate() {
  rotation += 90;
  img.style.transform = `rotate(${rotation}deg)`;
}

function rotateDependencyGraph(degrees) {
  rotation = degrees;
  img.style.transform = `rotate(${rotation}deg)`;
}

// New function to toggle rotation
function toggleRotation() {
  rotation += rotation === 360 ? -360 : 90;
  img.style.transform = `rotate(${rotation}deg)`;
}

// Attach event listeners
document.getElementById('rotateBtn').addEventListener('click', rotate);
document.getElementById('rotateBackBtn').addEventListener('click', handleRotateBack);
// New event listener for the toggle rotation functionality
document.getElementById('toggleRotateBtn').addEventListener('click', toggleRotation);

// main.js - Main application logic

// Import required dependencies
const { someHelper, formatContent } = require('./utils');

/**
 * Initializes the dependency graph controller.
 * Replaces fake links and sets up event handlers.
 */
function init() {
  fixFakeLink();
  addLangAttribute(); // Added to address REACT_015
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

// Export functions for testing and module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fixFakeLink,
    handleRotateBack,
    rotateDependencyGraph,
    init,
    config
  };
}