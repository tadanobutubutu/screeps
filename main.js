// ADD THE NEW FUNCTION HERE
function addLangAttributeToHtmlElement(doc) {
  const htmlElement = doc.querySelector('html');
  if (!htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', getLangAttribute(doc));
  }
}

/**
 * Add/fix landmark issues
 * @param { Document } doc - The document object to operate on
 */
function addFixLandmarkIssues(doc) {
  const landmarks = addProperLandmarkRegions(doc);
  ensureUniqueLandmarks(landmarks);
}

/**
 * Fix fake link issues
 * @param { Document } doc - The document object to operate on
 */
function fixFakeLinkIssues(doc) {
  const links = doc.querySelectorAll('a');
  links.forEach(link => {
    if (!link.href || link.href === '#') {
      link.setAttribute('role', 'presentation');
    }
  });
}

/**
 * Wrap primary content in main div
 * @param { Document } doc - The document object to operate on
 */
function wrapPrimaryContentInMain(doc) {
  const primaryContent = doc.querySelector('[role="main"], article, #content, .content');
  if (!primaryContent) {
    return;
  }
  
  const main = doc.createElement('div');
  main.className = 'main';
  main.setAttribute('role', 'main');
  
  if (primaryContent.parentNode) {
    primaryContent.parentNode.insertBefore(main, primaryContent);
    main.appendChild(primaryContent);
  }
}

/**
 * Add proper landmark regions to the document
 * @param { Document } doc - The document object to operate on
 */
function addProperLandmarkRegions(doc) {
  const landmarks = doc.querySelectorAll('nav, main, footer, aside, section, article');
  return Array.from(landmarks);
}

/**
 * Add ARIA attributes to form controls
 * @param { Document } doc - The document object to operate on
 */
function addAriaToFormControls(doc) {
  const inputs = doc.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    if (!input.id && input.type !== 'hidden') {
      const label = input.id ? doc.getElementById(input.id) : null;
      if (label) {
        input.setAttribute('aria-describedby', label.id || `label-${index}`);
      }
    }
  });
}

/**
 * Replace button IDs with accessible alternatives
 * @param { Document } doc - The document object to operate on
 */
function replaceMyButtonId(doc) {
  const buttons = doc.querySelectorAll('button');
  buttons.forEach((button, index) => {
    button.id = button.id || `button-${index}`;
  });
}

/**
 * Get the lang attribute from the document
 * @param { Document } doc - The document object to operate on
 * @returns { string } The language code
 */
function getLangAttribute(doc) {
  return doc.documentElement.lang || 'en';
}

/**
 * Get the full lang attribute including region
 * @param { Document } doc - The document object to operate on
 * @returns { string } The full language code
 */
function getFullLangAttribute(doc) {
  return doc.documentElement.lang || 'en-US';
}

/**
 * Validate landmark structure
 * @param { Element } element - The element to validate
 * @returns { boolean } Whether the landmark is valid
 */
function validateLandmark(element) {
  const validRoles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  const role = element.getAttribute('role');
  return role && validRoles.includes(role);
}

/**
 * Validate landmark structure in document
 * @param { Document } doc - The document object to validate
 * @returns { Array } Array of validation results
 */
function validateLandmarkStructure(doc) {
  const landmarks = doc.querySelectorAll('[role]');
  return Array.from(landmarks).map(el => ({
    element: el,
    valid: validateLandmark(el),
    role: el.getAttribute('role')
  }));
}

/**
 * Validate table accessibility
 * @param { HTMLTableElement } table - The table to validate
 * @returns { boolean } Whether the table is accessible
 */
function validateTableAccessibility(table) {
  const hasCaption = table.querySelector('caption');
  const hasHeaders = table.querySelector('th');
  return hasCaption && hasHeaders;
}

/**
 * Validate table structure
 * @param { Document } doc - The document object to validate
 * @returns { Array } Array of validation results
 */
function validateTableStructure(doc) {
  const tables = doc.querySelectorAll('table');
  return Array.from(tables).map(table => ({
    table,
    accessible: validateTableAccessibility(table)
  }));
}

/**
 * Get accessible name for SVG elements
 * @param { SVGElement } svg - The SVG element
 * @returns { string } The accessible name
 */
function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  const ariaLabel = svg.getAttribute('aria-label');
  const describedBy = svg.getAttribute('aria-describedby');
  
  if (ariaLabel) {
    return ariaLabel;
  }
  
  if (title) {
    return title.textContent;
  }
  
  if (describedBy) {
    const describedElement = document.getElementById(describedBy);
    return describedElement ? describedElement.textContent : '';
  }
  
  return '';
}

// ... (The rest of the existing functions and exports remain unchanged)

// ADD THE NEW FUNCTION TO THE EXPORTS
const { addMissingExportFunction } = require('./utils');

module.exports = {
  addProperLandmarkRegions,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  wrapPrimaryContentInMain,
  ensureUniqueLandmarks,
  createInPageButton,
  createAccessibleLink,
  getSvgAccessibleName,
  addMissingExportFunction,
  addLangAttributeToHtmlElement,
  addFixLandmarkIssues,
  fixFakeLinkIssues
};