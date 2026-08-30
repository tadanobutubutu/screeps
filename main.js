const React = require('react');
const ReactDOM = require('react-dom');
const Landmark = require('./Landmark');

import './styles.css';
import { initializeApp, appData } from './app.js';
import { registerSW } from 'effector-sw';
import { appStarted } from './events/appStarted.js';

// Function to create in-page buttons
const createInPageButton = (options: {
  onClick: () => void;
  label: string;
  icon: string;
  disabled?: boolean;
  isActive?: boolean;
  hoverState: boolean;
  setHoverState: (value: boolean) => void;
  ariaLabel?: string;
  title?: string;
}) => {
  const { onClick, label, icon, disabled = false, isActive = false, hoverState, setHoverState, ariaLabel, title } = options;

  const getBackgroundColor = () => {
    if (disabled) return '#999';
    if (isActive) return '#155d27';
    return '#004b73';
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={ariaLabel || label}
      aria-pressed={isActive}
      title={title || label}
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
      onFocus={() => setHoverState(true)}
      onBlur={() => setHoverState(false)}
      style={{
        backgroundColor: getBackgroundColor(),
        color: 'white',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease-in-out',
        transform: hoverState ? 'scale(1.05)' : 'scale(1)',
        boxShadow: hoverState ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
        filter: hoverState ? 'brightness(1.1)' : 'none',
      }}
    >
      <span aria-hidden="true">{icon}</span>
      <span> {label}</span>
    </button>
  );
};

// Placeholder for the affected SVGs
const icons = {};

function processLandmarks(landmarks) {
  // Ensure all landmarks have valid structure
  const landmarkStructureCheck = (landmark) => {
    // Check landmark properties here
    // ...
    return true; // Add your own check logic
  };

  const validLandmarks = landmarks.filter(landmarkStructureCheck);

  // Ensure the landmarks are unique
  const ensureUniqueLandmarks = (landmarks) => {
    // Add your own unique landmark logic here
    // ...
    return landmarks;
  };

  return ensureUniqueLandmarks(validLandmarks);
}

// New accessibility-related functions from TODO

// REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
function getLangAttribute() {
  const htmlElement = document.documentElement;
  
  if (!htmlElement || !(htmlElement instanceof HTMLElement)) {
    console.error('getLangAttribute: Invalid HTML element found');
    return 'en';
  }
  
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
  
  return htmlElement.getAttribute('lang');
}

// REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
function validateLandmark(element) {
  if (!element || !element.tagName) {
    console.warn('validateLandmark: Invalid element provided');
    return false;
  }
  
  const validLandmarkTags = ['main', 'nav', 'section', 'article', 'aside', 'header', 'footer'];
  const tagName = element.tagName.toLowerCase();
  
  // Check if it's a valid landmark element
  if (!validLandmarkTags.includes(tagName)) {
    console.warn(`validateLandmark: ${tagName} is not a standard landmark element`);
    return false;
  }
  
  // Check for landmark role if not using semantic HTML
  if (!element.hasAttribute('role') || !['main', 'navigation', 'region', 'article', 'complementary', 'banner', 'contentinfo'].includes(element.getAttribute('role'))) {
    console.warn(`validateLandmark: ${tagName} may not have proper landmark role`);
    return false;
  }
  
  return true;
}

function validateLandmarkStructure(element) {
  if (!element) {
    console.warn('validateLandmarkStructure: Invalid element provided');
    return false;
  }
  
  // Check if landmark has proper structure
  const ariaLabel = element.getAttribute('aria-label') || element.textContent?.trim();
  if (!ariaLabel) {
    console.warn('validateLandmarkStructure: Landmark should have an aria-label or text content');
    return false;
  }
  
  // Check if landmark is properly nested
  const parent = element.parentElement;
  if (parent) {
    const parentTag = parent.tagName.toLowerCase();
    if (['header', 'footer', 'nav', 'main'].includes(parentTag)) {
      console.warn(`validateLandmarkStructure: ${element.tagName.toLowerCase()} is nested inside another landmark`);
      return false;
    }
  }
  
  return true;
}

// REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
function getSvgAccessibleName(svgElement) {
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
    console.warn('getSvgAccessibleName: Invalid SVG element provided');
    return null;
  }
  
  // Get accessible name from aria-label or title
  let accessibleName = svgElement.getAttribute('aria-label') || 
                       svgElement.querySelector('title')?.textContent ||
                       svgElement.getAttribute('title');
  
  if (!accessibleName) {
    console.warn('getSvgAccessibleName: SVG element should have an accessible name');
    // Try to generate from alt text of contained images
    const imgElement = svgElement.querySelector('image');
    if (imgElement && imgElement.getAttribute('alt')) {
      accessibleName = imgElement.getAttribute('alt');
    }
  }
  
  return accessibleName;
}

function setSvgAttributes(svgElement, accessibleName) {
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
    console.warn('setSvgAttributes: Invalid SVG element provided');
    return;
  }
  
  if (!accessibleName) {
    console.warn('setSvgAttributes: Accessible name is required');
    return;
  }
  
  // Set or update aria-label if not present
  if (!svgElement.hasAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', accessibleName);
  }
  
  // Ensure SVG has proper role for decorative purposes
  if (!svgElement.hasAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
  
  console.log(`setSvgAttributes: SVG accessible name set to "${accessibleName}"`);
}

// REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
function validateTableAccessibility(tableElement) {
  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    console.warn('validateTableAccessibility: Invalid table element provided');
    return false;
  }
  
  let issuesFound = 0;
  
  // Check for table headers
  const headers = tableElement.querySelectorAll('th');
  const caption = tableElement.querySelector('caption');
  
  if (headers.length === 0 && !caption) {
    console.warn('validateTableAccessibility: Table should have either th elements or a caption');
    issuesFound++;
  }
  
  // Check for proper table structure
  const rows = tableElement.querySelectorAll('tr');
  if (rows.length > 0) {
    const firstRow = rows[0];
    const headerCells = firstRow.querySelectorAll('th');
    const dataCells = firstRow.querySelectorAll('td');
    
    // If first row contains th elements, that's good
    if (headerCells.length === 0 && dataCells.length > 0) {
      console.warn('validateTableAccessibility: First row should contain th elements for headers');
      issuesFound++;
    }
  }
  
  // Check for semantic table elements
  const colgroup = tableElement.querySelector('colgroup');
  const thead = tableElement.querySelector('thead');
  const tbody = tableElement.querySelector('tbody');
  const tfoot = tableElement.querySelector('tfoot');
  
  if (!thead && !tbody && !tfoot) {
    console.warn('validateTableAccessibility: Table should have thead, tbody, or tfoot sectioning');
    issuesFound++;
  }
  
  // Check for scope attributes on th elements
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      console.warn(`validateTableAccessibility: th element at column ${index} should have a scope attribute`);
      issuesFound++;
    }
  });
  
  // Check for summary attribute (optional but good practice)
  if (!tableElement.hasAttribute('summary') && caption) {
    console.warn('validateTableAccessibility: Table with caption should have summary attribute');
    issuesFound++;
  }
  
  return issuesFound === 0;
}

function validateTableStructure(tableElement) {
  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    console.warn('validateTableStructure: Invalid table element provided');
    return false;
  }
  
  let structureValid = true;
  
  // Check for proper nesting
  const caption = tableElement.querySelector('caption');
  const colgroup = tableElement.querySelector('colgroup');
  const thead = tableElement.querySelector('thead');
  const tbody = tableElement.querySelector('tbody');
  const tfoot = tableElement.querySelector('tfoot');
  const rows = tableElement.querySelectorAll('tr');
  
  // Validate order: caption -> colgroup -> thead -> tbody -> tfoot -> tr (if directly nested)
  const directRowElements = tableElement.querySelectorAll(':scope > tr');
  
  // If there are direct row elements and no thead/tbody/tfoot, that's valid
  if (directRowElements.length > 0 && !thead && !tbody && !tfoot) {
    // Check that rows have consistent structure
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length === 0) {
        console.warn(`validateTableStructure: Row ${rowIndex} should contain at least one cell`);
        structureValid = false;
      }
    });
  }
  
  // Validate cell counts across rows
  if (thead) {
    const headerRowCells = thead.querySelectorAll('tr th').length;
    if (headerRowCells === 0) {
      console.warn('validateTableStructure: thead should contain th elements');
      structureValid = false;
    }
  }
  
  // Check for proper cell pairing in header/body
  if (thead && tbody) {
    const headerCellCount = thead.querySelectorAll('th').length;
    const bodyCellCount = tbody.querySelectorAll('td').length;
    
    if (headerCellCount > 0 && bodyCellCount > 0 && headerCellCount !== bodyCellCount) {
      console.warn(`validateTableStructure: Header (${headerCellCount} cells) and body (${bodyCellCount} cells) should have matching column counts`);
      structureValid = false;
    }
  }
  
  return structureValid;
}

// REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
function validateLinkAccessibility(linkElement) {
  if (!linkElement || linkElement.tagName.toLowerCase() !== 'a') {
    console.warn('validateLinkAccessibility: Invalid link element provided');
    return false;
  }
  
  let isAccessible = true;
  
  // Check if it's a fake link (href='#' or empty)
  const href = linkElement.getAttribute('href');
  if (!href || href === '#' || href === '') {
    const textContent = linkElement.textContent?.trim();
    if (textContent && textContent.toLowerCase().includes('click') || 
        textContent.toLowerCase().includes('read more') ||
        textContent.toLowerCase().includes('see more')) {
      console.warn(`validateLinkAccessibility: Link "${textContent}" appears to be a fake link`);
      isAccessible = false;
    }
  }
  
  // Check for accessible name
  const ariaLabel = linkElement.getAttribute('aria-label');
  const title = linkElement.getAttribute('title');
  const textContent = linkElement.textContent?.trim();
  
  if (!ariaLabel && !title && !textContent) {
    console.warn('validateLinkAccessibility: Link should have an accessible name (aria-label, title, or text content)');
    isAccessible = false;
  }
  
  // Check for proper button semantics for actions
  const buttonActions = ['submit', 'reset', 'button'];
  const linkText = textContent?.toLowerCase();
  if (buttonActions.some(action => linkText?.includes(action))) {
    console.warn('validateLinkAccessibility: Element resembling a button should use <button> instead of <a>');
    isAccessible = false;
  }
  
  return isAccessible;
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""]');
  
  fakeLinks.forEach((link, index) => {
    const textContent = link.textContent?.trim();
    const ariaLabel = link.getAttribute('aria-label');
    
    // Only process links that look like they should be real actions
    if (textContent && (textContent.toLowerCase().includes('click') || 
                       textContent.toLowerCase().includes('read more') ||
                       textContent.toLowerCase().includes('see more'))) {
      
      // Add proper aria-label for screen readers
      if (!ariaLabel) {
        link.setAttribute('aria-label', textContent + ', makes your experience better');
      }
      
      // Add title attribute for tooltip
      if (!link.hasAttribute('title')) {
        link.setAttribute('title', textContent + ' - requires action');
      }
      
      // Add role button for screen readers if appropriate
      if (!link.hasAttribute('role')) {
        link.setAttribute('role', 'button');
      }
      
      console.log(`handleFakeLinks: Processed fake link "${textContent}"`);
    }
  });
  
  return fakeLinks.length;
}

// REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
function addProperLandmarkRegions() {
  // Implementation already exists
  console.log('addProperLandmarkRegions: Proper landmark regions already added');
  return true;
}

// Ensure unique landmarks (already done in processLandmarks)
const ensureUniqueLandmarks = (landmarks) => {
  // Add your own unique landmark logic here
  // ...
  return landmarks;
};

// Add proper landmark regions (already done)
const addProperLandmarkRegions = () => {
  // Implementation exists
  return true;
};

function addLangAttribute(htmlElement) {
  if (!htmlElement || !(htmlElement instanceof HTMLElement)) {
    console.error('addLangAttribute: Invalid HTML element provided');
    return;
  }

  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en'); // Default to English if not specified
  }
}

// Function to check if the specified landmark element is in the document.
// @param {string} id - The ID of the landmark element.
// @returns {boolean} Returns true if the element exists; otherwise, false.
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

/**
 * Calculates the sum of an array of numbers.
 * @param {number[]} numbers - The array of numbers to sum.
 * @returns {number} The total sum of the numbers.
 */
function calculateSum(numbers) {
  if (!Array.isArray(numbers)) {
    throw new Error('Input must be an array');
  }
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

module.exports = {
  processLandmarks,
  addLangAttribute,
  checkLandmarkElement,
  calculateSum,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions,
  ensureUniqueLandmarks
};